import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:5000";

const CONVERSATION_ID = "6a9bf06df492d1cd968889e9";

/*
 * Replace these with fresh JWT tokens
 * for the two users.
 */
const SUNDAS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhOTgwYWE1YjUyM2UzMDU4NTcxMDNlMiIsImlhdCI6MTc4ODYyNjY0MSwiZXhwIjoxNzg5MjMxNDQxfQ.wuwjwjln521SvXGG7jKjqAIEeMT7FVIYiiGTQnBi_gQ";
const SADIA_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhOWJlMzMzMDYzMDc1ZWE1ZTE2MDAyNiIsImlhdCI6MTc4ODYyNjc3MiwiZXhwIjoxNzg5MjMxNTcyfQ.dgXTXP1JahQtDuskMoEKilTwC2iUzZpBDTgJAcJvCLk";

const sundas = io(SERVER_URL, {
    auth: {
        token: SUNDAS_TOKEN,
    },
});

const sadia = io(SERVER_URL, {
    auth: {
        token: SADIA_TOKEN,
    },
});

/*
 * SUNDAS
 */
sundas.on("connect", () => {
    console.log("Sundas connected:", sundas.id);

    sundas.emit(
        "join_conversation",
        CONVERSATION_ID,
        (response) => {
            console.log("Sundas joined:", response);

            if (response.success) {
                setTimeout(() => {
                    sundas.emit(
                        "send_message",
                        {
                            conversationId: CONVERSATION_ID,
                            content: "Hello Sadia! This is a real-time message.",
                        },
                        (messageResponse) => {
                            console.log(
                                "Message response:",
                                messageResponse
                            );
                        }
                    );
                }, 1000);
            }
        }
    );
});

/*
 * SADIA
 */
sadia.on("connect", () => {
    console.log("Sadia connected:", sadia.id);

    sadia.emit(
        "join_conversation",
        CONVERSATION_ID,
        (response) => {
            console.log("Sadia joined:", response);
        }
    );
});

/*
 * SADIA RECEIVES MESSAGE
 */
sadia.on("new_message", (data) => {
    console.log("Sadia received:", data.message);

    sadia.emit(
        "mark_messages_read",
        CONVERSATION_ID,
        (response) => {
            console.log("Messages read:", response);
        }
    );
});

/*
 * TYPING TEST
 */
setTimeout(() => {
    sundas.emit("typing_start", CONVERSATION_ID);

    setTimeout(() => {
        sundas.emit("typing_stop", CONVERSATION_ID);
    }, 2000);
}, 3000);

sadia.on("user_typing", (data) => {
    console.log("Sadia sees typing:", data);
});

sadia.on("user_stopped_typing", (data) => {
    console.log("Sadia sees typing stopped:", data);
});

/*
 * READ RECEIPT
 */
sundas.on("messages_read", (data) => {
    console.log("Sundas sees messages read:", data);
});

/*
 * CONNECTION ERRORS
 */
sundas.on("connect_error", (error) => {
    console.error("Sundas socket error:", error.message);
});

sadia.on("connect_error", (error) => {
    console.error("Sadia socket error:", error.message);
});