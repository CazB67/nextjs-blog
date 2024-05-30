import { useEffect, useState, FormEvent } from "react";
import { supabase } from "../../lib/supabase/server";
import styles from "./comments.module.css";
import utilStyles from "@/styles/utils.module.css";
import Alert from "../Alert/alert";

interface Comment {
  id: string;
  blog_id: string;
  nickname: string;
  email: string;
  comment: string;
  created_at: Date;
}

interface PostData {
  id: string;
}

export default function Comments({ postData }: { postData: PostData }) {
  const [comment, setComment] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [alertType, setAlertType] = useState<'noAlert' | 'success' | 'error'>('noAlert');
  const [loading, setLoading] = useState<boolean>(false);

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

  const onSubmit = async (e: FormEvent) => {
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
        setAlertType('success');
      } else {
        console.error("Error:", data.error);
        setAlertType('error');
      }
    } catch (error) {
      console.error("Network error:", error);
      setAlertType('error');
    } finally {
      setLoading(false);
    }
  };

  const switchDescription = () => {
    if (alertType === 'success') return <p className={`${styles.description} ${utilStyles.padding_1}`}>Your comment has been sent and is waiting approval. Once approved, it will become visible to all. </p>;
    else return <p className={`${styles.description} ${utilStyles.padding_1}`}>There was an error sending your comment. Try again later.</p>;
  };

  return (
    <div className={`${utilStyles.backgroundWhite} ${utilStyles.borderRadius_6} ${utilStyles.padding_1}`}>
      <div className={styles.comments}>
        {commentList.length > 0 && (
          <>
            <h2>What people are saying</h2>
            {commentList.map((comment, index) => (
              <div className={`${styles.container} ${utilStyles.borderRadius_6}`} key={index}>
                <header className={`${utilStyles.smallText} ${utilStyles.lightText}`}>
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
            <label htmlFor="comment">
              Comment
            </label>
            <textarea
              id="comment"
              onChange={(e) => setComment(e.target.value)}
              placeholder="Your comment"
              className={`${styles.input} ${utilStyles.borderRadius_6} ${utilStyles.padding_1}`}
              value={comment}
            />
          </div>
          <div className={styles.labelWithInput}>
            <label htmlFor="email">
              Email
            </label>
            <input
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Your email"
              className={`${styles.input} ${utilStyles.borderRadius_6} ${utilStyles.padding_1}`}
              value={email}
            />
          </div>
          <div className=
          {styles.labelWithInput}>
            <label htmlFor="nickname">
              Nickname
            </label>
            <input
              id="nickname"
              onChange={(e) => setNickname(e.target.value)}
              type="text"
              placeholder="Your nickname"
              className={`${styles.input} ${utilStyles.borderRadius_6} ${utilStyles.padding_1}`}
              value={nickname}
            />
          </div>
          <button
            className={`${styles.button} ${utilStyles.colorWhite} ${utilStyles.borderRadius_6}`}
            type="submit"
            disabled={loading || !comment}
          >
            {loading ? "Loading..." : "Send comment"}
          </button>
        </form>
      </div>
      <Alert type={alertType} onClick={() => setAlertType('noAlert')}>{switchDescription()}</Alert>
    </div>
  );
}
