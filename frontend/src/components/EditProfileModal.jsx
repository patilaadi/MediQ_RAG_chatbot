import React, { useState, useEffect } from "react";
import {
    X,
    Camera,
    Save,
} from "lucide-react";

const EditProfileModal = ({
    open,
    setOpen,
    user,
    setUser,
}) => {

    const [formData, setFormData] =
        useState({
            name: "",
            email: "",
            picture: "",
        });

    useEffect(() => {
        if (!open || !user) return;

        setFormData((prev) => {
            if (
                prev.name === user.name &&
                prev.email === user.email &&
                prev.picture === user.picture
            ) {
                return prev;
            }

            return {
                name: user.name || "",
                email: user.email || "",
                picture: user.picture || "",
            };
        });
    }, [open, user?.id]);
    // Handle Input Change
    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]:
                e.target.value,
        });
    };

    // Save Profile
    const handleSave = async () => {

        try {

            const token =
                localStorage.getItem("token");

            console.log(token);

            const response = await fetch(
                "http://localhost:8080/api/users/profile",
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`,
                    },

                    body: JSON.stringify(
                        formData
                    ),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {

                alert(
                    data.message ||
                    "Update Failed"
                );

                return;
            }

            // Update frontend state
            setUser(data.user);

            // Update localStorage
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            alert(
                "Profile Updated"
            );

            setOpen(false);

        } catch (error) {

            console.log(error);

            alert(
                "Something went wrong"
            );
        }
    };

    if (!open) return null;

    return (

        <div
            className="
        fixed
        inset-0
        bg-black/60
        backdrop-blur-sm
        flex
        items-center
        justify-center
        z-50
      "
        >

            {/* Modal */}
            <div
                className="
          w-full
          max-w-md
          bg-[#202123]
          rounded-3xl
          border
          border-gray-700
          shadow-2xl
          overflow-hidden
          animate-in
          fade-in
          zoom-in-95
        "
            >

                {/* Header */}
                <div
                    className="
            flex
            items-center
            justify-between
            px-6
            py-5
            border-b
            border-gray-700
          "
                >

                    <h2
                        className="
              text-xl
              font-semibold
              text-white
            "
                    >

                        Edit Profile

                    </h2>

                    <button
                        onClick={() =>
                            setOpen(false)
                        }
                        className="
              p-2
              rounded-lg
              hover:bg-[#2A2B32]
              transition-all
            "
                    >

                        <X
                            size={20}
                            className="text-gray-400"
                        />

                    </button>

                </div>

                {/* Body */}
                <div className="p-6">

                    {/* Profile Image */}
                    <div
                        className="
              flex
              flex-col
              items-center
              mb-6
            "
                    >

                        <div className="relative">

                            <img
                                src={
                                    formData.picture ||
                                    "https://i.pravatar.cc/150"
                                }
                                alt="profile"
                                className="
                  w-24
                  h-24
                  rounded-full
                  object-cover
                  border-4
                  border-gray-700
                "
                            />

                            <button
                                className="
                  absolute
                  bottom-0
                  right-0
                  bg-green-500
                  hover:bg-green-600
                  p-2
                  rounded-full
                  shadow-lg
                  transition-all
                "
                            >

                                <Camera
                                    size={16}
                                    className="text-white"
                                />

                            </button>

                        </div>

                    </div>

                    {/* Name */}
                    <div className="mb-5">

                        <label
                            className="
                block
                text-sm
                text-gray-300
                mb-2
              "
                        >

                            Full Name

                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="
                w-full
                bg-[#2A2B32]
                border
                border-gray-600
                focus:border-green-500
                focus:ring-2
                focus:ring-green-500/20
                text-white
                rounded-xl
                px-4
                py-3
                outline-none
                transition-all
              "
                        />

                    </div>

                    {/* Email */}
                    <div className="mb-6">

                        <label
                            className="
                block
                text-sm
                text-gray-300
                mb-2
              "
                        >

                            Email Address

                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="
                w-full
                bg-[#2A2B32]
                border
                border-gray-600
                focus:border-green-500
                focus:ring-2
                focus:ring-green-500/20
                text-white
                rounded-xl
                px-4
                py-3
                outline-none
                transition-all
              "
                        />

                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        className="
              w-full
              flex
              items-center
              justify-center
              gap-2
              bg-green-500
              hover:bg-green-600
              text-white
              font-medium
              py-3
              rounded-xl
              transition-all
              shadow-lg
            "
                    >

                        <Save size={18} />

                        Save Changes

                    </button>

                </div>

            </div>

        </div>
    );
};

export default EditProfileModal;