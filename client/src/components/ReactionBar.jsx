import { useMemo, useRef, useEffect, useState } from "react";

const EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "😡"];

export default function ReactionBar({
  message,
  userId,
  onReact,
}) {
  const [showPicker, setShowPicker] = useState(false);

  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target)
      ) {
        setShowPicker(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const groupedReactions = useMemo(() => {
    const grouped = {};

    (message.reactions || []).forEach((reaction) => {
      if (!grouped[reaction.emoji]) {
        grouped[reaction.emoji] = {
          count: 0,
          mine: false,
        };
      }

      grouped[reaction.emoji].count++;

      const reactionUser =
        typeof reaction.user === "object"
          ? reaction.user._id
          : reaction.user;

      if (reactionUser === userId) {
        grouped[reaction.emoji].mine = true;
      }
    });

    return Object.entries(grouped);
  }, [message.reactions, userId]);

  return (
    <>
      {!message.deleted && (
        <>
          <button
            onClick={() =>
              setShowPicker(!showPicker)
            }
            className="absolute -top-2 -left-2 opacity-0 group-hover:opacity-100 transition bg-white rounded-full shadow px-1 text-sm z-20"
          >
            😊
          </button>

          {showPicker && (
            <div
              ref={pickerRef}
              className="absolute -top-12 left-0 bg-white rounded-full shadow-lg px-2 py-1 flex gap-1 z-50"
            >
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={async () => {
                    try {
                      await onReact(emoji);
                    } finally {
                      setShowPicker(false);
                    }
                  }}
                  className="hover:scale-125 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {groupedReactions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {groupedReactions.map(
            ([emoji, data]) => (
              <button
                key={emoji}
                onClick={async () => {
                  await onReact(emoji);
                }}
                className={`px-2 py-0.5 rounded-full border text-xs transition ${
                  data.mine
                    ? "bg-blue-100 border-blue-500 text-blue-700"
                    : "bg-white text-black"
                }`}
              >
                {emoji} {data.count}
              </button>
            )
          )}
        </div>
      )}
    </>
  );
}