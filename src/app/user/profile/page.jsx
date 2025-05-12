"use client";
import React, { useEffect, useRef, useState } from "react";
import { IoMdSettings } from "react-icons/io";
import {
  IoAddSharp,
  IoCheckmarkSharp,
  IoChevronDownOutline,
} from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
const options = ["Yangi", "Mashhur", "Eng zo'ri"];
const tabs = ["Yozuvlar", "Xatcho’plar", "Ko’proq o’qish", "Qoralamalar"];
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

const getColorFromUsername = (username) => {
  const colors = [
    "#F87171",
    "#60A5FA",
    "#34D399",
    "#FBBF24",
    "#A78BFA",
    "#F472B6",
    "#38BDF8",
    "#4ADE80",
    "#FB923C",
    "#E879F9",
  ];
  if (!username) return colors[0];

  let sum = 0;
  for (let i = 0; i < username.length; i++) {
    sum += username.charCodeAt(i);
  }
  return colors[sum % colors.length];
};

const isValidImageUrl = (url) => {
  if (!url) return false;
  try {
    new URL(url);
    return /\.(jpeg|jpg|gif|png|webp)$/i.test(url); // faqat rasm formatlarini tekshiradi
  } catch (_) {
    return false;
  }
};

function Profil() {
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef1 = useRef(null);
  const toggleOptions = () => {
    setIsOpen(!isOpen);
  };
  const options1 = [
    { id: 1, name: "Tez" },
    { id: 2, name: "Yangiliklar" },
    { id: 3, name: "Tanlash" },
    { id: 4, name: "Ko'rib chiqish" },
  ];
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef1.current &&
        !dropdownRef1.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("Hammasi");
  const buttons = ["Hammasi", "Xabarlar", "Sharhlar", "Yangiliklar"];
  const [activeContent, setActiveContent] = useState("Hammasi");
  const [activeTab, setActiveTab] = useState("Yozuvlar");

  const dropdownRef = useRef();

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const selectOption = (option) => {
    setSelectedOption(option);
    setMenuOpen(false);
  };
  const toggleOptionsFilter = (e) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  // user info backend

  const [user, setUser] = useState();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) return;

    fetch("https://otaku.up-it.uz/api/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser({
          name: data.username,
          email: data.email,
          photo: data.photo,
          background: data.background,
          subscribers:
            Array.isArray(data.followers) && data.followers.length > 0
              ? data.followers.length
              : 0,
          subscriptions:
            Array.isArray(data.following) && data.following.length > 0
              ? data.following.length
              : 0,

          bio: data.bio,
          posts: data.posts,
        });
      })
      .catch((err) =>
        console.error("Foydalanuvchi ma'lumotlarini olishda xatolik:", err)
      );
  }, []);

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";
  const bgColor = getColorFromUsername(user?.name);

  // activ tab

  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab");
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  if (!user) return <p>Yuklanmoqda...</p>;
  return (
    <div className="px-10">
      <div className="bg-white rounded-[20px]">
        {/* profil bacground */}
        <div
          className="relative"
          style={{
            backgroundImage: `url(${
              user.background && user.background.startsWith("http")
                ? user.background
                : "https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdjg5NC1rdWwtMDZfMS5qcGc.jpg"
            })`,
            width: "100%",
            height: "37vh",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "20px 20px 0px 0px",
          }}
        >
          <div className=" w-[80px] h-[80px] absolute -bottom-9 left-6 rounded-full flex justify-center bg-white items-center">
            {user ? (
              user.photo ? (
                <img
                  src={user.photo}
                  style={{
                    objectFit: "cover",
                  }}
                  className="w-[70px] h-[70px] rounded-full"
                  alt="User Avatar"
                />
              ) : (
                <div
                  className="w-[70px] h-[70px] rounded-full flex items-center justify-center text-white s-semibold text-2xl uppercase"
                  style={{ backgroundColor: bgColor }}
                >
                  {user.name.charAt(0)}
                </div>
              )
            ) : null}
          </div>
          <Link href={"/user/settings"}>
            <button className="absolute flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm cursor-pointer -bottom-18 right-8">
              <IoMdSettings />
              Sozlamalar
            </button>
          </Link>
        </div>

        {/* profil info */}

        <div className="px-5 pb-5 mt-15">
          <h1 className="text-[25px] font-bold">{user.name}</h1>
          <h3 className="mt-1 text-[#B1B1B1]">@{user.email}</h3>
          <p className="mt-1">{user.bio}</p>

          {/* subscrebars */}

          <div className="flex items-center gap-2 mt-6">
            <button>
              <span className="font-semibold mr-2 text-[18px]">
                {user.subscribers}
              </span>
              Obunachi
            </button>
            <button>
              <span className="font-semibold mr-2 text-[18px]">
                {user.subscriptions}
              </span>
              ta Obuna
            </button>
          </div>

          {/* activ tab  */}

          <div className="border-b-[#50D1F9] flex gap-10 text-[16px] font-medium mt-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`pb-2  cursor-pointer ${
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

      <div className="">
        {activeTab === "Yozuvlar" && (
          <div>
            {/* Profil  search */}

            <div className="flex items-center justify-between mt-2">
              <div className="relative w-[740px] flex gap-2 text-[#B1B1B1] text-[16px] mt-2">
                <CiSearch className="absolute top-[10px] left-3 text-[20px] " />
                <input
                  className=" w-full h-[40px] bg-white rounded-lg  ps-11 outline-none"
                  placeholder="Qidirish"
                />
              </div>
              <div className="text-[#B1B1B1]">
                <div
                  className="relative custom-select-container "
                  ref={dropdownRef}
                >
                  <button
                    className="flex items-center gap-2 p-2 text-blackl"
                    onClick={toggleOptionsFilter}
                  >
                    <p>{selectedOption}</p>
                    <IoChevronDownOutline />
                  </button>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-[37px] z-20 left-[0] p-3 w-[140px]a bg-white rounded-xl shadow-md"
                    >
                      {options.map((option) => (
                        <button
                          key={option}
                          className="flex items-center justify-between cursor-pointer text-black p-[5px] w-full text-left"
                          onClick={() => selectOption(option)}
                        >
                          {option}{" "}
                          {selectedOption === option && (
                            <IoCheckmarkSharp className="text-[#50D1F9]" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* prfil  menu filter */}

            {/* Filter tugmalar */}
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

            {/* Tanlangan kontent */}
            <div className="mt-4 ">
              {activeContent === "Hammasi" && (
                <>
                  {/* Profil creat post */}

                  <div className="relative mt-4" ref={dropdownRef1}>
                    <button
                      onClick={toggleOptions}
                      className="flex w-full items-center cursor-pointer gap-3 justify-start mt-4 h-[50px] rounded-xl px-4 bg-white shadow-md text-[#B1B1B1]"
                    >
                      <img
                        src="https://i.pinimg.com/736x/bd/90/0d/bd900d77a9bc9fb6f24f593cfe8011b6.jpg"
                        alt="user"
                        className="w-[33px] h-[33px] rounded-full"
                      />
                      <p>Post yarating</p>
                    </button>

                    {isOpen && (
                      <div className="absolute top-[60px] left-0 w-[200px] flex flex-col z-20 p-2 bg-white shadow-md rounded-xl transition-all duration-300 ease-in-out transform scale-95 opacity-0 scale-100 opacity-100">
                        {options1.map((option) => (
                          <button
                            key={option.id}
                            className="flex items-center w-full gap-2 px-4 py-2 text-gray-700 transition-colors duration-200 rounded-md cursor-pointer hover:bg-gray-100"
                            onClick={() => {
                              if (option.name === "Tez") {
                                router.push("/createpost");
                              }
                            }}
                          >
                            {option.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* creat post info */}

                  {user.posts && user.posts.length > 0 ? (
                    <></>
                  ) : (
                    <>
                      <div className="flex flex-col items-center justify-center bg-white w-full h-[173px] mt-4 rounded-xl">
                        <p className=" w-[366px] text-[#ADA6A6] text-center text-[14px]">
                          Agar sizda biror post yoki maqola uchun qiziqarli
                          g‘oyangiz bo‘lsa, uyalmang va darhol yozishni
                          boshlang.
                        </p>
                        <Link href={"/createpost"}>
                          <button className="border-[#50D1F9] text-[#50D1F9] px-4 h-[35px] rounded-xl flex items-center gap-2 cursor-pointer bg-[#B6F9FF6E] mt-4">
                            <IoAddSharp />
                            Post yarating
                          </button>
                        </Link>
                      </div>
                    </>
                  )}
                </>
              )}
              {activeContent === "Xabarlar" && (
                <>
                  <div className="flex flex-col items-center justify-center bg-white w-full h-[173px] mt-4 rounded-xl">
                    <p className=" w-[366px] text-[#ADA6A6] text-center text-[14px]">
                      (ー_ー)ノ Xabarlar topilmadi
                    </p>
                  </div>
                </>
              )}
              {activeContent === "Sharhlar" && (
                <>
                  <div className="flex flex-col items-center justify-center bg-white w-full h-[173px] mt-4 rounded-xl">
                    <p className=" w-[366px] text-[#ADA6A6] text-center text-[14px]">
                      (ー_ー)ノHozircha sharhlar yo‘q
                    </p>
                  </div>
                </>
              )}
              {activeContent === "Yangiliklar" && (
                <>
                  <div className="flex flex-col items-center justify-center bg-white w-full h-[173px] mt-4 rounded-xl">
                    <p className=" w-[366px] text-[#ADA6A6] text-center text-[14px]">
                      (ー_ー)ノ Yangiliklar mavjud emas
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        {activeTab === "Xatcho’plar" && (
          <div>
            {/* creat post info */}

            <div className="flex flex-col items-center justify-center bg-white w-full h-[173px] mt-4 rounded-xl">
              <p className=" w-[366px] text-[#ADA6A6] text-center text-[14px]">
                Xatcho‘plarga istalgan yozuvlarni qo‘shishingiz mumkin, shunda
                ularni yo‘qotib qo‘ymaysiz yoki keyinroq ularga qaytmaysiz.
              </p>
            </div>
          </div>
        )}
        {activeTab === "Ko’proq o’qish" && (
          <div>
            {/* creat post info */}

            <div className="flex flex-col items-center justify-center bg-white w-full h-[173px] mt-4 rounded-xl">
              <p className=" w-[70px] text-[#ADA6A6] text-center text-[14px]">
                (ー_ー)ノ Natija yoʻq
              </p>
            </div>
          </div>
        )}
        {activeTab === "Qoralamalar" && (
          <div>
            {/* creat post info */}

            <div className="flex flex-col items-center justify-center bg-white w-full h-[173px] mt-4 rounded-xl">
              <p className=" w-[366px] text-[#ADA6A6] text-center text-[14px]">
                Agar sizda biror post yoki maqola uchun qiziqarli g‘oyangiz
                bo‘lsa, uyalmang va darhol yozishni boshlang.
              </p>
              <button className="border-[#50D1F9] text-[#50D1F9] px-4 h-[35px] rounded-xl flex items-center gap-2 cursor-pointer bg-[#B6F9FF6E] mt-4">
                <IoAddSharp />
                Post yarating
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profil;
