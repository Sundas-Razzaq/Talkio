import { useRef, useState } from "react";

const MAX_LENGTH = 5000;

const MessageComposer = ({ onSend, disabled }) => {
    const [value, setValue] = useState("");
    const textareaRef = useRef(null);

    const trimmed = value.trim();
    const canSend = !disabled && trimmed.length > 0;

    const handleSubmit = () => {
        if (!canSend) return;

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
                onChange={(event) => setValue(event.target.value)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
            />

            <button
                type="submit"
                className="message-composer__send"
                aria-label="Send message"
                disabled={!canSend}
            >
                Send
            </button>
        </form>
    );
};

export default MessageComposer;