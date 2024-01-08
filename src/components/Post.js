import React, { useEffect, useState, useContext, useRef } from "react";
import { Link, useParams, Redirect } from "react-router-dom";
import firebase from "firebase/app";
import Loader from "./Loader";
import UserImage from "../images/user.svg";
import { EllipsisOutlined } from "@ant-design/icons";
import { Popconfirm } from "antd";
import FirebaseContext from "../Context/Firebase/FirebaseContext";

const Post = (props) => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [owner, setOwner] = useState(null);
  const [heart, setHeart] = useState(false);
  const myRef = useRef(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [latestComments, setLatest] = useState([]);
  var l;

  const arraysEqual = (a, b) => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (var i = 0; i < a.length; ++i) {
      if (a[i].comment != b[i].comment || a[i].time != b[i].time) return false;
    }
    return true;
  };

  const handleConfirm = () => {
    var postRef = firebase.storage().ref().child(`/posts/${post.id}`);
    postRef
      .delete()
      .then(function () {
        firebase
          .firestore()
          .doc(`/posts/${post.id}`)
          .delete()
          .then(() => {
            props.history.push("/");
          });
      })
      .catch(function (error) {
        // Uh-oh, an error occurred!
      });
  };
  const { user, updateProfile } = useContext(FirebaseContext);

  const compare = (a, b) => {
    return a.time < b.time;
  };

  const reload = () => {
    firebase
      .firestore()
      .doc(`/posts/${postId}`)
      .get()
      .then((data) => {
        if (!data.exists) {
          props.history.push("/");
        } else {
          if (data.data().comments) {
            let x = data.data().comments;
            x.sort(compare);

            let newComments = [];
            let resol = [];
            for (let i = 0; i < x.length; i++) {
              resol.push(
                firebase
                  .firestore()
                  .doc(`/users/${x[i].email}`)
                  .get()
                  .then((u) => {
                    let p = {};
                    p = {
                      ...x[i],
                      userName: u.data().userName,
                      photoURL: u.data().photoURL,
                    };
                    return p;
                  })
              );
            }
            Promise.all(resol).then((ans) => {
              setComments([...ans]);
            });

            let count = 0;
            var newArr = [];

            for (let i = x.length - 1; i >= 0; i--) {
              if (count == 2) break;
              firebase
                .firestore()
                .doc(`/users/${x[i].email}`)
                .get()
                .then((u) => {
                  let temp = {};
                  temp.comment = x[i].comment;
                  temp.time = x[i].comment;
                  temp.userName = u.data().userName;
                  temp.photoURL = u.data().photoURL;
                  newArr.push(temp);
                });
              count += 1;
            }
            setLatest(newArr);
          }
          setPost(data.data());
          if (myRef && myRef.current)
            myRef.current.scrollIntoView({ behavior: "smooth" });

          firebase
            .firestore()
            .doc(`/users/${data.data().email}`)
            .get()
            .then((u) => {
              setOwner(u.data());
            });
        }
      });
    if (myRef && myRef.current)
      myRef.current.scrollIntoView({ behavior: "smooth" });
    setComment("");
  };

  useEffect(() => {
    firebase
      .firestore()
      .doc(`/posts/${postId}`)
      .get()
      .then((data) => {
        if (!data.exists) {
          props.history.push("/");
        } else {
          if (data.data().comments) {
            let x = data.data().comments;
            x.sort(compare);

            let newComments = [];
            let resol = [];
            for (let i = 0; i < x.length; i++) {
              resol.push(
                firebase
                  .firestore()
                  .doc(`/users/${x[i].email}`)
                  .get()
                  .then((u) => {
                    let p = {};
                    p = {
                      ...x[i],
                      userName: u.data().userName,
                      photoURL: u.data().photoURL,
                    };
                    return p;
                  })
              );
            }
            Promise.all(resol).then((ans) => {
              setComments([...ans]);
            });

            let count = 0;
            var newArr = [];

            for (let i = x.length - 1; i >= 0; i--) {
              if (count == 2) break;
              firebase
                .firestore()
                .doc(`/users/${x[i].email}`)
                .get()
                .then((u) => {
                  let temp = {};
                  temp.comment = x[i].comment;
                  temp.time = x[i].comment;
                  temp.userName = u.data().userName;
                  temp.photoURL = u.data().photoURL;
                  newArr.push(temp);
                });
              count += 1;
            }
            setLatest(newArr);
          }
          setPost(data.data());

          firebase
            .firestore()
            .doc(`/users/${data.data().email}`)
            .get()
            .then((u) => {
              setOwner(u.data());
            });
        }
      });
  }, []);

  useEffect(() => {
    if (myRef && myRef.current)
      myRef.current.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const handleDBClick = () => {
    setHeart(true);
    setTimeout(() => {
      setHeart(false);
    }, 800);
    if (post.likes) {
      if (!post.likes.includes(user.email)) {
        firebase
          .firestore()
          .doc(`/posts/${post.id}`)
          .get()

          .then((data) => {
            l = data.data().likes;
            l.push(user.email);
            firebase.firestore().doc(`/posts/${post.id}`).update({
              likes: l,
            });
          })
          .then(() => {
            setPost({ ...post, likes: l });
          });
      }
    } else {
      firebase
        .firestore()
        .doc(`/posts/${post.id}`)
        .get()
        .then((data) => {
          if (data.data().likes) l = data.data().likes;
          else l = [];
          l.push(user.email);
          firebase.firestore().doc(`/posts/${post.id}`).update({
            likes: l,
          });
        })
        .then(() => {
          setPost({ ...post, likes: l });
        });
    }
  };

  const handleLike = () => {
    if (post.likes) {
      if (!post.likes.includes(user.email)) {
        firebase
          .firestore()
          .doc(`/posts/${post.id}`)
          .get()

          .then((data) => {
            l = data.data().likes;
            l.push(user.email);
            firebase.firestore().doc(`/posts/${post.id}`).update({
              likes: l,
            });
          })
          .then(() => {
            setPost({ ...post, likes: l });
          });
      } else {
        firebase
          .firestore()
          .doc(`/posts/${post.id}`)
          .get()
          .then((data) => {
            l = data.data().likes;
            l = l.filter((like) => like !== user.email);
            firebase.firestore().doc(`/posts/${post.id}`).update({
              likes: l,
            });
          })
          .then(() => {
            setPost({ ...post, likes: l });
          });
      }
    } else {
      firebase
        .firestore()
        .doc(`/posts/${post.id}`)
        .get()
        .then((data) => {
          if (data.data().likes) l = data.data().likes;
          else l = [];
          l.push(user.email);
          firebase.firestore().doc(`/posts/${post.id}`).update({
            likes: l,
          });
        })
        .then(() => {
          setPost({ ...post, likes: l });
        });
    }
  };

  const handleBookmark = () => {
    if (user.bookmarks) {
      if (!user.bookmarks.includes(post.id)) {
        let bookmarks = user.bookmarks;
        bookmarks.push(post.id);
        firebase
          .firestore()
          .doc(`/users/${user.email}`)
          .update({
            bookmarks,
          })
          .then(() => {});
      } else {
        let bookmarks = user.bookmarks;
        bookmarks = bookmarks.filter((like) => like !== post.id);
        firebase
          .firestore()
          .doc(`/users/${user.email}`)
          .update({
            bookmarks,
          })
          .then(() => {});
      }
    } else {
      let bookmarks = [];
      bookmarks.push(post.id);
      firebase
        .firestore()
        .doc(`/users/${user.email}`)
        .update({
          bookmarks,
        })
        .then(() => {});
    }
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (comment.length) {
      let newComment = {};
      newComment.time = Date.now();
      newComment.comment = comment;
      newComment.email = user.email;
      firebase
        .firestore()
        .doc(`/posts/${post.id}`)
        .get()
        .then((data) => {
          if (data.data().comments) {
            let comments = data.data().comments;
            comments.push(newComment);
            firebase
              .firestore()
              .doc(`/posts/${post.id}`)
              .update({ comments })
              .then(() => {
                reload();
              });
          } else {
            let comments = [];
            comments.push(newComment);
            firebase
              .firestore()
              .doc(`/posts/${post.id}`)
              .update({ comments })
              .then(() => {
                reload();
              });
          }
        });
    }
    if (myRef && myRef.current)
      myRef.current.scrollIntoView({ behavior: "smooth" });
    setComment("");
  };

  return (
    <div>
      {!post || !owner ? (
        <Loader />
      ) : (
        <div className="post_grid">
          <div className="post_photo_grid">
            <div className="post_info_grid">
              {owner.photoURL ? (
                <img src={owner.photoURL} className="image_circle" />
              ) : (
                <img src={UserImage} className="image_circle" />
              )}
              <div>
                <Link to={`/${owner.userName}`} style={{ color: "black" }}>
                  {owner.userName}
                </Link>
              </div>
              {(user.email === post.email ||
                user.email == "mihir0699@gmail.com") && (
                <Popconfirm
                  placement="top"
                  title="Delete this post?"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={handleConfirm}
                >
                  <EllipsisOutlined
                    style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}
                    className="delete_post"
                  />
                </Popconfirm>
              )}
            </div>
            <div className="inner_div1">
              <img
                src={post.url}
                className="post_image"
                onDoubleClick={handleDBClick}
              />
              {heart && <i className="fa fa-heart" aria-hidden="true" />}
            </div>
          </div>
          <div className="bio_grid">
            {owner.photoURL ? (
              <img src={owner.photoURL} className="image_circle1" />
            ) : (
              <img src={UserImage} className="image_circle1" />
            )}
            <div>
              <Link to={`/${owner.userName}`} style={{ color: "black" }}>
                {" "}
                <span className="post_userName">{owner.userName}</span>{" "}
              </Link>{" "}
              {post.caption}
            </div>
          </div>
          <div className="comments_grid">
            <div className="grid_c_div">
              {comments.length ? (
                <>
                  {comments.map((c) => (
                    <div className="comment_grid">
                      {c.photoURL ? (
                        <img src={c.photoURL} className="comment_img" />
                      ) : (
                        <img src={UserImage} className="comment_img" />
                      )}

                      <div>
                        {" "}
                        <span className="post_userName">
                          <Link
                            to={`/${c.userName}`}
                            style={{ color: "black" }}
                          >
                            {c.userName}
                          </Link>
                        </span>
                        &nbsp;
                        <span>{c.comment}</span>
                      </div>
                    </div>
                  ))}
                  <div ref={myRef}></div>
                </>
              ) : null}
            </div>
          </div>
          {latestComments.length ? (
            <div className="mobile_comments">
              <span className="view_comments">
                View all {comments.length} comments
              </span>
              {latestComments.length > 0 &&
                latestComments.map((com) => (
                  <div>
                    <span className="post_userName">
                      <Link to={`/${com.userName}`} style={{ color: "black" }}>
                        {com.userName}
                      </Link>
                    </span>
                    &nbsp;
                    {com.comment}
                  </div>
                ))}
            </div>
          ) : null}

          <div className="compo_grid">
            <div className="heart_grid">
              <div>
                <i
                  class={`${
                    !post.likes
                      ? `fa fa-heart-o`
                      : post.likes.includes(user.email)
                      ? `fa fa-heart`
                      : `fa fa-heart-o`
                  }`}
                  aria-hidden="true"
                  onClick={handleLike}
                />
                <i class="fa fa-comment-o" aria-hidden="true"></i>
                <i class="fa fa-share" aria-hidden="true"></i>
              </div>
              <i
                className={`${
                  !user.bookmarks
                    ? `fa fa-bookmark-o bookmark`
                    : user.bookmarks.includes(post.id)
                    ? `fa fa-bookmark bookmark`
                    : `fa fa-bookmark-o bookmark`
                }`}
                aria-hidden="true"
                onClick={handleBookmark}
                style={{ marginRight: "0.5rem" }}
              ></i>
            </div>
            <div className="separate">
              {post.likes ? (
                <span className="likes_div">{post.likes.length} likes</span>
              ) : (
                <span className="likes_div">0 likes</span>
              )}
            </div>
            <div className="text_input_post">
              <form onSubmit={handleComment}>
                <input
                  type="text"
                  placeholder="Add a comment"
                  onChange={(e) => setComment(e.target.value)}
                  value={comment}
                />
                <button
                  className="post_comment"
                  onClick={handleComment}
                  disabled={comment.length ? undefined : "disabled"}
                >
                  Post
                </button>
              </form>
            </div>
          </div>
          <div className="hidden_input">
            <div className="text_input_post1">
              <form onSubmit={handleComment}>
                <input
                  type="text"
                  placeholder="Add a comment"
                  onChange={(e) => setComment(e.target.value)}
                  value={comment}
                />
                <button
                  className="post_comment"
                  type="submit"
                  disabled={comment.length ? undefined : "disabled"}
                >
                  Post
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
