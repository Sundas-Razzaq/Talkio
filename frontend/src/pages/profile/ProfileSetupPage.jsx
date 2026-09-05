import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        <main className="profile-setup-page">
            <section className="profile-setup-card">
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

                <form
                    className="profile-setup-form"
                    onSubmit={handleSubmit}
                >
                    <div className="profile-setup-form__field">
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
                    </div>

                    <div className="profile-setup-form__field">
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
                    </div>

                    <div className="profile-setup-form__field">
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
                    </div>

                    {error ? (
                        <p className="form-message form-message--error">
                            {error}
                        </p>
                    ) : null}

                    <button
                        className="button button--primary"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Setting up..."
                            : "Continue to Talkio"}
                    </button>
                </form>
            </section>
        </main>
    );
}

export default ProfileSetupPage;