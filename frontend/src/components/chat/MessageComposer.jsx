import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { motion } from "framer-motion";

const MAX_LENGTH = 5000;
const MAX_HEIGHT = 160;
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

    // ---- auto-grow ----
    useLayoutEffect(() => {
        const el = textareaRef.current;
        if (!el) return;

        el.style.height = "auto";
        const next = Math.min(el.scrollHeight, MAX_HEIGHT);
        el.style.height = `${next}px`;

        el.style.overflowY =
            el.scrollHeight > MAX_HEIGHT ? "auto" : "hidden";
    }, [value]);

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
        <motion.form
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

            <motion.button
                type="submit"
                className="message-composer__send"
                aria-label="Send message"
                disabled={!canSend}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
            >
                {sending ? "Sending…" : <Send size={17} strokeWidth={2} />}
                <span className="sr-only">Send</span>
            </motion.button>
        </motion.form>
    );
};

export default MessageComposer;