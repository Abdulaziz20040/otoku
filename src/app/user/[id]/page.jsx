"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { useParams } from "next/navigation";

const tabs = ["Yozuvlar", "Ko’proq o’qish"];
const buttons = ["Hammasi", "Xabarlar", "Sharhlar", "Yangiliklar"];

function UserProfil() {
  const route = useRouter();
  const [user, setUser] = useState({
    username: "",
    email: "",
    photo: "",
    bio: "",
    followers: 0,
    following: 0,
    posts: [],
  });

  // ...
  const params = useParams();
  const id = params?.id; // endi bu orqali ID olasiz

  useEffect(() => {
    if (id) {
      // id bo'lsa, API yoki boshqa ma'lumotlarni yuklash
      // Misol: fetch(`/api/user/${id}`).then(response => response.json()).then(setUser);
      console.log("User ID:", id);
    }
  }, [id]); // faqat id o'zgarganda ishlaydi

  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "Yozuvlar"
  );
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeContent, setActiveContent] = useState("Hammasi");
  const dropdownRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      const userItem = localStorage.getItem("user");

      let currentUser = null;
      try {
        currentUser = JSON.parse(userItem);
      } catch (e) {
        currentUser = { username: userItem };
      }

      if (!token) {
        route.push("/auth/login");
        return;
      }

      try {
        const res = await axios.get(
          `https://otaku.up-it.uz/api/user/id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = res.data;

        const isUserFollowing = data.followers?.some(
          (follower) => follower.username === currentUser?.username
        );
        setIsSubscribed(isUserFollowing);

        setUser({
          username: data.username,
          name: data.name,
          email: data.email,
          photo: data.photo,
          background:
            data.background ||
            "https://img.freepik.com/free-photo/anime-moon-landscape_23-2151645871.jpg",
          followers: data.followers?.length || 0,
          following: data.following?.length || 0,
          bio: data.bio,
          posts: data.posts || [],
          subscribers: data.followers?.length || 0,
          subscriptions: data.following?.length || 0,
        });
      } catch (error) {
        console.error("❌ Foydalanuvchini olishda xatolik:", error);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id, route]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubscribe = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      route.push("/auth/login");
      return;
    }

    try {
      const url = isSubscribed
        ? `https://otaku.up-it.uz/api/user/unfollow/${user.username}`
        : `https://otaku.up-it.uz/api/user/follow/${user.username}`;

      await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setIsSubscribed(!isSubscribed);
      setUser((prev) => ({
        ...prev,
        subscribers: isSubscribed ? prev.subscribers - 1 : prev.subscribers + 1,
      }));
    } catch (error) {
      console.error(
        "❌ Obuna holatini o‘zgartirishda xatolik:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="px-10">
      <div className="bg-white rounded-[20px] pt-6">
        <div className="relative w-full">
          <img
            className="w-[70px] h-[70px] rounded-full ms-6"
            src={
              user?.photo ||
              "https://i.pinimg.com/736x/52/fe/0f/52fe0fbcc8939e69873f89489994d9e5.jpg"
            }
            alt="Profil rasmi"
          />
          <div className="absolute flex items-center gap-4 right-6 top-6">
            <div className="relative" ref={dropdownRef}>
              <BsThreeDots
                className="text-[#B7B1B1] text-[20px] cursor-pointer"
                onClick={() => setIsDropdownVisible(!isDropdownVisible)}
              />
              {isDropdownVisible && (
                <div className="absolute top-6 right-0 w-[150px] bg-white shadow-md rounded-lg">
                  {["Ulashish", "Shikoyat qilish", "Bloklash"].map(
                    (item, index) => (
                      <button
                        key={index}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100"
                        onClick={() => setIsDropdownVisible(false)}
                      >
                        {item}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            <button
              className={`px-3 py-1 rounded-lg cursor-pointer transition-all duration-300 ${
                isSubscribed
                  ? "bg-blue-200 text-blue-600" // Obunada bo‘lsa — och rang
                  : "bg-blue-400 text-white" // Obuna bo‘lmasa — to‘q rang
              }`}
              onClick={handleSubscribe}
            >
              {isSubscribed ? "Obunani bekor qilish" : "Obuna bo‘ling"}
            </button>
          </div>
        </div>

        <div className="px-5 pb-5 mt-8">
          <h1 className="text-[25px] font-bold">
            {user?.username || "Noma'lum"}
          </h1>
          <h3 className="mt-1 text-[#B1B1B1]">{user?.email || "Noma'lum"}</h3>
          <p className="mt-1">{user?.bio || "Aniq bio mavjud emas"}</p>

          <div className="flex items-center gap-2 mt-6">
            <button>
              <span className="font-semibold text-[18px]">
                {user?.subscribers}
              </span>{" "}
              Obunachi
            </button>
            <button>
              <span className="font-semibold text-[18px]">
                {user?.subscriptions}
              </span>{" "}
              Obuna
            </button>
          </div>

          <div className="border-b-[#50D1F9] flex gap-10 text-[16px] font-medium mt-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`pb-2 cursor-pointer ${
                  activeTab === tab
                    ? "border-b-2 border-[#50D1F9] text-[#50D1F9]"
                    : "text-[#B1B1B1]"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        {activeTab === "Yozuvlar" && (
          <div>
            <div className="flex items-center justify-between mt-2">
              <div className="relative w-[740px] flex gap-2 text-[#B1B1B1] text-[16px] mt-2">
                <CiSearch className="absolute top-[10px] left-3 text-[20px]" />
                <input
                  className="w-full h-[40px] bg-white rounded-lg ps-11 outline-none"
                  placeholder="Qidirish"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4">
              {buttons.map((btn) => (
                <button
                  key={btn}
                  onClick={() => setActiveContent(btn)}
                  className={`flex items-center gap-2 p-2 w-[100px] cursor-pointer h-[35px] rounded-2xl justify-center transition-colors duration-200 ${
                    activeContent === btn
                      ? "bg-[#B6F9FF6E] text-[#50D1F9]"
                      : "bg-white text-black"
                  }`}
                >
                  {btn}
                </button>
              ))}
            </div>

            <div className="mt-4">
              {activeContent === "Hammasi" && user?.posts?.length > 0 ? (
                user.posts.map((post, index) => (
                  <div
                    key={index}
                    className="p-4 mb-4 bg-white shadow-sm rounded-xl"
                  >
                    <p className="text-lg font-semibold">{post.title}</p>
                    <p className="text-sm text-gray-500">{post.caption}</p>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center w-full h-[173px] bg-white rounded-xl">
                  <p className="text-[#ADA6A6] text-center text-[14px]">
                    (ー_ー)ノ Hozircha yozuvlar yo‘q
                  </p>
                </div>
              )}
              {activeContent === "Xabarlar" && (
                <p>(ー_ー)ノ Xabarlar topilmadi</p>
              )}
              {activeContent === "Sharhlar" && (
                <p>(ー_ー)ノ Hozircha sharhlar yo‘q</p>
              )}
              {activeContent === "Yangiliklar" && (
                <p>(ー_ー)ノ Yangiliklar mavjud emas</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "Ko’proq o’qish" && (
          <div className="flex flex-col items-center justify-center bg-white w-full h-[173px] mt-4 rounded-xl">
            <p className="text-[#ADA6A6] text-center text-[14px]">
              (ー_ー)ノ Natija yoʻq
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfil;
