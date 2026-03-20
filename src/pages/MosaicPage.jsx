import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import GuestView from "../components/GuestView";
import OwnerView from "../components/OwnerView";
import { createOwnerSupabaseClient, supabase } from "../lib/supabase";

function getOwnerToken(mosaicId) {
  try {
    const map = JSON.parse(localStorage.getItem("mosaic_owner_tokens") || "{}");
    return map[mosaicId] || "";
  } catch {
    return "";
  }
}

function MosaicPage() {
  const { id: mosaicId } = useParams();
  const [searchParams] = useSearchParams();
  const isGuestMode = searchParams.get("mode") === "guest";

  const [mosaic, setMosaic] = useState(null);
  const [connections, setConnections] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const sortedConnections = useMemo(
    () => [...connections].sort((a, b) => new Date(b.added_at) - new Date(a.added_at)),
    [connections]
  );

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      setLoading(true);
      setError("");

      const [{ data: mosaicData, error: mosaicError }, { data: connectionData, error: connectionError }] =
        await Promise.all([
          supabase.from("mosaics").select("id, owner_name, created_at").eq("id", mosaicId).single(),
          supabase.from("connections").select("*").eq("mosaic_id", mosaicId).order("added_at", { ascending: false }),
        ]);

      if (!isMounted) return;

      if (mosaicError || !mosaicData || connectionError) {
        setError("Hmm, something went wrong - try again?");
        setLoading(false);
        return;
      }

      setMosaic(mosaicData);
      setConnections(connectionData || []);
      setLoading(false);
    }

    bootstrap();

    const channel = supabase
      .channel(`mosaic-${mosaicId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "connections",
          filter: `mosaic_id=eq.${mosaicId}`,
        },
        (payload) => {
          setConnections((current) => {
            if (payload.eventType === "INSERT") {
              return [payload.new, ...current.filter((item) => item.id !== payload.new.id)];
            }
            if (payload.eventType === "DELETE") {
              return current.filter((item) => item.id !== payload.old.id);
            }
            if (payload.eventType === "UPDATE") {
              return current.map((item) => (item.id === payload.new.id ? payload.new : item));
            }
            return current;
          });
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [mosaicId]);

  const handleDeleteConnection = async (connectionId) => {
    const ownerToken = getOwnerToken(mosaicId);
    if (!ownerToken) {
      return {
        ok: false,
        message: "Only the Mosaic owner can remove a card.",
      };
    }

    const ownerSupabase = createOwnerSupabaseClient(ownerToken);
    const { error: deleteError } = await ownerSupabase.from("connections").delete().eq("id", connectionId);
    if (deleteError) {
      return {
        ok: false,
        message: "Only the Mosaic owner can remove a card.",
      };
    }
    return { ok: true };
  };

  const handleGuestSubmit = async ({ selfieFile, firstName, lastName, linkedinUrl, instagramHandle, twitterHandle }) => {
    const extension = selfieFile.name.split(".").pop() || "jpg";
    const filePath = `${mosaicId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;

    const { error: uploadError } = await supabase.storage.from("selfies").upload(filePath, selfieFile, {
      cacheControl: "3600",
      upsert: false,
    });

    if (uploadError) {
      return {
        ok: false,
        message: "Could not upload your selfie right now - please try again.",
      };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("selfies").getPublicUrl(filePath);

    const { error: insertError } = await supabase.from("connections").insert({
      mosaic_id: mosaicId,
      selfie_url: publicUrl,
      first_name: firstName.trim(),
      last_name: lastName.trim() || null,
      linkedin_url: linkedinUrl.trim() || null,
      instagram_handle: instagramHandle.trim() || null,
      twitter_handle: twitterHandle.trim() || null,
    });

    if (insertError) {
      return {
        ok: false,
        message: "Hmm, something went wrong - try again?",
      };
    }

    return { ok: true };
  };

  if (loading) {
    return <div className="grid min-h-screen place-items-center text-charcoal/70">Loading your Mosaic...</div>;
  }

  if (!mosaic || error) {
    return (
      <div className="grid min-h-screen place-items-center px-4 text-center text-charcoal">
        <div>
          <h1 className="font-display text-4xl">We couldn't find that Mosaic.</h1>
          <p className="mt-2 text-charcoal/70">{error || "Hmm, something went wrong - try again?"}</p>
        </div>
      </div>
    );
  }

  if (isGuestMode) {
    return (
      <GuestView
        mosaic={mosaic}
        onSubmitConnection={handleGuestSubmit}
        wallPreview={sortedConnections}
        error={error}
      />
    );
  }

  return (
    <OwnerView mosaic={mosaic} connections={sortedConnections} onDeleteConnection={handleDeleteConnection} canDelete />
  );
}

export default MosaicPage;
