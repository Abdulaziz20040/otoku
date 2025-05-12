"use clint";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaThumbsDown,
  FaRegThumbsDown,
  FaRegThumbsUp,
  FaRegCommentDots,
  FaEllipsisH,
} from "react-icons/fa";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useRouter } from "next/navigation";

function Posts({ userOnly, usernameFilter }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://otaku.up-it.uz/api/post")
      .then((res) => {
        const transformedData = res.data
          .map((item) => ({
            id: item._id,
            ownerId: item.owner?._id,
            username: item.owner?.username || "Noma'lum",
            fullName: item.owner?.fullName || "Noma'lum",
            user_img: item.owner?.photo,
            title: item.title,
            caption: item.caption,
            content:
              item.content?.[0]?.url ||
              "https://i.pinimg.com/736x/12/f7/5d/12f75de94183c57ddcd8d5f634846e00.jpg",
            comments: item.comments || [],
            likes_count: item.likes?.length || 0,
            dislikes: item.dislikes || 0,
            date: new Date(item.createdAt).toLocaleDateString("uz-UZ", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
          }))
          .filter((post) =>
            userOnly && usernameFilter ? post.username === usernameFilter : true
          );
        setData(transformedData);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Xatolik yuz berdi:", e);
        setLoading(false);
      });
  }, [userOnly, usernameFilter]);

  return (
    <div className="mt-3 space-y-4">
      {loading
        ? Array(3)
            .fill(0)
            .map((_, index) => <SkeletonPost key={index} />)
        : data.map((item) => <PostCard key={item.id} item={item} />)}
    </div>
  );
}

function SkeletonPost() {
  return (
    <div className="w-full h-auto gap-3 p-4 bg-white shadow-md rounded-2xl">
      <div className="flex items-center gap-3">
        <Skeleton circle width={30} height={30} />
        <Skeleton width={100} height={16} />
        <Skeleton width={60} height={14} />
      </div>
      <div className="mt-4">
        <Skeleton width="75%" height={24} />
        <Skeleton width="100%" height={16} count={2} />
        <Skeleton width="100%" height={250} className="mt-4" />
      </div>
      <div className="flex items-center justify-start gap-6 mt-4">
        <Skeleton width={40} height={16} />
        <Skeleton width={40} height={16} />
        <Skeleton width={40} height={16} />
        <Skeleton width={40} height={16} />
      </div>
    </div>
  );
}

function PostCard({ item }) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likes_count || 0);
  const [dislikeCount, setDislikeCount] = useState(item.dislikes || 0);
  const router = useRouter();

  const handleLike = () => {
    axios
      .post(`https://otaku.up-it.uz/api/post/${item.id}/like`)
      .then(() => {
        if (!liked) {
          setLikeCount((prev) => prev + 1);
          if (disliked) {
            setDisliked(false);
            setDislikeCount((prev) => prev - 1);
          }
        } else {
          setLikeCount((prev) => prev - 1);
        }
        setLiked(!liked);
      })
      .catch((e) => {
        console.error("Like xatoligi:", e);
      });
  };

  const handleDislike = () => {
    if (disliked) {
      setDislikeCount((prev) => prev - 1);
    } else {
      setDislikeCount((prev) => prev + 1);
      if (liked) {
        setLiked(false);
        setLikeCount((prev) => prev - 1);
      }
    }
    setDisliked(!disliked);
  };

  const usernameInitial = item.fullName?.charAt(0).toUpperCase() || "";

  return (
    <div className="w-full h-auto gap-3 p-4 bg-white shadow-md rounded-2xl">
      <div className="flex items-center gap-3">
        {item.user_img ? (
          <img
            onClick={() => router.push(`/user/${item.username}`)}
            src={item.user_img}
            alt="Foydalanuvchi rasmi"
            className="w-[30px] h-[30px] rounded-full object-cover cursor-pointer"
          />
        ) : (
          <div
            className="w-[35px] h-[35px] rounded-full flex items-center justify-center text-white font-semibold text-sm uppercase"
            style={{ backgroundColor: "#4caf50" }}
          >
            {usernameInitial}
          </div>
        )}
        <p
          className="font-semibold cursor-pointer text-md hover:underline"
          onClick={() => router.push(`/user/${item.ownerId}`)}
        >
          {item.username || "Noma'lum"}
        </p>
        <p className="text-sm text-gray-500">{item.date}</p>
      </div>

      <div className="mt-4">
        <Link href={`/details/${item.id}`}>
          <h1 className="text-lg font-semibold">{item.title}</h1>
          <p className="mt-2">{item.caption || "Tavsif mavjud emas"}</p>
          <img
            className="object-cover w-full h-[450px] mt-4 rounded-xl"
            src={item.content}
            alt="Post content"
          />
        </Link>
      </div>

      <div className="flex items-center justify-start gap-6 mt-4 text-gray-600">
        <button
          className="flex items-center gap-1 cursor-pointer"
          onClick={handleLike}
        >
          <FaRegThumbsUp className={liked ? "text-blue-500" : ""} />
          <p>{likeCount}</p>
        </button>
        <button onClick={handleDislike} className="flex items-center gap-1">
          {disliked ? (
            <FaThumbsDown className="text-blue-500" />
          ) : (
            <FaRegThumbsDown />
          )}
          <span>{dislikeCount}</span>
        </button>
        <button className="flex items-center gap-1">
          <FaRegCommentDots />
          <span>{Array.isArray(item.comments) ? item.comments.length : 0}</span>
        </button>
        <button>
          <FaEllipsisH />
        </button>
      </div>
    </div>
  );
}

export default Posts;
