import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
    updateProfile,
    uploadProfilePicture,
} from "../../api/userApi.js";

import { useAuth } from "../../hooks/useAuth.js";
import { resolveErrorMessage } from "../../utils/helpers.js";

function ProfileSetupPage() {
    const navigate = useNavigate();

    const { user, refreshUser } = useAuth();

    const [name, setName] = useState(user?.name || "");
    const [bio, setBio] = useState(user?.bio || "");
    const [picture, setPicture] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        setError("");

        try {
            await updateProfile({
                name,
                bio,
            });

            if (picture) {
                const formData = new FormData();

                formData.append(
                    "profilePicture",
                    picture
                );

                await uploadProfilePicture(formData);
            }

            await refreshUser();

            navigate("/dashboard", {
                replace: true,
            });
        } catch (requestError) {
            setError(
                resolveErrorMessage(requestError)
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.main
            className="profile-setup-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
        >
            <motion.section
                className="profile-setup-card"
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                <header className="profile-setup-card__header">
                    <p className="profile-setup-card__eyebrow">
                        Almost there
                    </p>

                    <h1 className="profile-setup-card__title">
                        Set up your profile
                    </h1>

                    <p className="profile-setup-card__subtitle">
                        Tell your friends a little about yourself.
                    </p>
                </header>

                <motion.form
                    className="profile-setup-form"
                    onSubmit={handleSubmit}
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
                >
                    <motion.div className="profile-setup-form__field" variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
                        <label
                            htmlFor="profile-name"
                            className="profile-setup-form__label"
                        >
                            Name
                        </label>

                        <input
                            id="profile-name"
                            className="profile-setup-form__input"
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            required
                        />
                    </motion.div>

                    <motion.div className="profile-setup-form__field" variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
                        <label
                            htmlFor="profile-bio"
                            className="profile-setup-form__label"
                        >
                            Bio
                        </label>

                        <textarea
                            id="profile-bio"
                            className="profile-setup-form__textarea"
                            value={bio}
                            maxLength={160}
                            onChange={(event) =>
                                setBio(event.target.value)
                            }
                        />
                    </motion.div>

                    <motion.div className="profile-setup-form__field" variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
                        <label
                            htmlFor="profile-picture"
                            className="profile-setup-form__label"
                        >
                            Profile picture
                        </label>

                        <input
                            id="profile-picture"
                            className="profile-setup-form__file"
                            type="file"
                            accept="image/*"
                            onChange={(event) =>
                                setPicture(
                                    event.target.files?.[0] ||
                                    null
                                )
                            }
                        />
                    </motion.div>

                    {error ? (
                        <p className="form-message form-message--error">
                            {error}
                        </p>
                    ) : null}

                    <motion.button
                        className="button button--primary"
                        type="submit"
                        disabled={loading}
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {loading
                            ? "Setting up..."
                            : "Continue to Talkio"}
                    </motion.button>
                </motion.form>
            </motion.section>
        </motion.main>
    );
}

export default ProfileSetupPage;