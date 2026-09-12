import { useEffect, useRef, useState } from "react";

const MAX_LENGTH = 5000;
const TYPING_DEBOUNCE_MS = 1500;

const MessageComposer = ({
    onSend,
    onTypingStart,
    onTypingStop,
    disabled,
    sending,
}) => {
    const [value, setValue] = useState("");
    const textareaRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const isTypingRef = useRef(false);

    const trimmed = value.trim();
    const canSend = !disabled && !sending && trimmed.length > 0;

    const stopTyping = () => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }

        if (isTypingRef.current) {
            isTypingRef.current = false;
            onTypingStop?.();
        }
    };

    useEffect(() => {
        return () => {
            stopTyping();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (event) => {
        setValue(event.target.value);

        if (disabled) return;

        if (!isTypingRef.current) {
            isTypingRef.current = true;
            onTypingStart?.();
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            stopTyping();
        }, TYPING_DEBOUNCE_MS);
    };

    const handleSubmit = () => {
        if (!canSend) return;

        stopTyping();
        onSend(trimmed);
        setValue("");

        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSubmit();
        }
    };

    return (
        <form
            className="message-composer"
            onSubmit={(event) => {
                event.preventDefault();
                handleSubmit();
            }}
        >
            <textarea
                ref={textareaRef}
                className="message-composer__input"
                placeholder="Type a message"
                aria-label="Type a message"
                rows={1}
                maxLength={MAX_LENGTH}
                value={value}
                onChange={handleChange}
                onBlur={stopTyping}
                onKeyDown={handleKeyDown}
                disabled={disabled}
            />

            <button
                type="submit"
                className="message-composer__send"
                aria-label="Send message"
                disabled={!canSend}
            >
                {sending ? "Sending…" : "Send"}
            </button>
        </form>
    );
};

export default MessageComposer;