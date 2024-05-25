import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase/server";
import styles from "./comments.module.css";

export default function Comments({ postData }) {
  const [comment, setComment] = useState("");
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [commentList, setCommentList] = useState([]);

  const getCommentList = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select()
      .eq("blog_id", postData.id)
      .eq("published", true) // only fetch published comments
      .order("created_at", { ascending: true });
    if (!error && data) {
      setCommentList(data);
    } else {
      setCommentList([]);
    }
  };

  useEffect(() => {
    getCommentList();
  }, []);

  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/comments/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blog_id: postData.id,
          nickname,
          email,
          comment,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setLoading(false);
        setComment("");
        setEmail("");
        setNickname("");
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.commentWrapper}>
      <div className="baseFlex flexColumn fullWidth padding1_0">
        {commentList.length > 0 && (
          <>
            <h2>What people are saying</h2>
            {commentList.map((comment, index) => (
              <div className={styles.container} key={index}>
                <header className={styles.smallText}>
                  {`Posted by ${comment.nickname} on ${new Date(
                    comment.created_at
                  ).toLocaleTimeString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}`}
                </header>
                <p className="mt-4">{comment.comment}</p>
              </div>
            ))}
          </>
        )}
      </div>
      <div className="min-w-[600px]">
        <h1 className="text-4xl font-bold ">Share your thoughts</h1>
        <form className={styles.labelWithInput} onSubmit={onSubmit}>
          <div className={styles.labelWithInput}>
            <label htmlFor="comment" className="mb-2 mt-6 text-lg block">
              Comment
            </label>
            <textarea
              id="comment"
              onChange={(e) => setComment(e.target.value)}
              placeholder="Your comment"
              className={styles.input}
              value={comment}
            />
          </div>
          <div className={styles.labelWithInput}>
            <label htmlFor="email" className="mb-2 mt-6 text-lg block">
              Email
            </label>
            <input
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Your email"
              className={styles.input}
              value={email}
            />
          </div>
          <div className={styles.labelWithInput}>
            <label htmlFor="nickname" className="mb-2 mt-6 text-lg block">
              Nickname
            </label>
            <input
              id="nickname"
              onChange={(e) => setNickname(e.target.value)}
              type="text"
              placeholder="Your nickname"
              className={styles.input}
              value={nickname}
            />
          </div>
          <button
            className={styles.button}
            type="submit"
            disabled={loading || !comment}
          >
            {loading ? "Loading..." : "Send comment"}
          </button>
        </form>
      </div>
    </div>
  );
}
