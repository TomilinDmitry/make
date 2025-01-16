import React, { useEffect, useState } from "react";
import s from "./style.module.scss";
import { useDispatch, useSelector } from "app/service/hooks/hooks";
import {
  getPlayerComments,
  getPlayerCommentsReplies,
  sendPlayerCommentReplies,
} from "app/api/apiPlayer";
import {
  ICommentProps,
  IPlayerCommentDataRepliesResults,
} from "app/types/type";
import { getUsersProfileList } from "app/api/apiLessons";
import channel from "../../../app/assets/profileCard/unknown_user.svg";
import { RootState } from "app/service/store";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
export const Comment = ({
  commentData,
  profileData,
}: ICommentProps) => {
  const [openResponse, setOpenResponse] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [createDate, setCreateDate] = useState("01.01.2024");
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const dispatch = useDispatch();
  const { repliesByCommentId, playerData } = useSelector(
    (state) => state.player,
  );
  const { userData } = useSelector((state) => state.user);
  const replies = useSelector(
    (state: RootState) =>
      state.player.repliesByCommentId[commentData.id] || [],
  );
  const { usersProfiles } = useSelector((state) => state.lessons);

  const [fetchedUserIds, setFetchedUserIds] = useState<Set<number>>(
    new Set(),
  );
  let [photoUrl, setPhotoUrl] = useState(
    profileData?.photo
      ? `https://api.lr45981.tw1.ru${profileData.photo}`
      : channel,
  );
  const ids: number[] = usersProfiles?.map((el) => el.user_id) || [];

  const [fetchedCommentReplies, setFetchedCommentReplies] = useState<
    number[]
  >([]);
  const { idLesson } = useParams();
  useEffect(() => {
    const fetchRepliesAndProfiles = async () => {
      if (
        openResponse &&
        commentData.id &&
        !fetchedCommentReplies.includes(commentData.id)
      ) {
        await getPlayerCommentsReplies(dispatch, commentData.id);

        setFetchedCommentReplies((prev) => [...prev, commentData.id]);

        const replies = repliesByCommentId[commentData.id];
        if (replies) {
          const newIds = replies.map((reply) => reply.user_id);

          const combinedUserIds = new Set<number>([
            ...ids,
            ...newIds,
          ]);

          const idsString = Array.from(combinedUserIds).join(",");

          if (combinedUserIds.size > fetchedUserIds.size) {
            await getUsersProfileList(dispatch, idsString);

            setFetchedUserIds(combinedUserIds);
          }
        }
      }
    };

    fetchRepliesAndProfiles();
  }, [
    openResponse,
    commentData.id,
    dispatch,
    repliesByCommentId,
    fetchedCommentReplies,
    fetchedUserIds,
    ids,
  ]);
  // Форматирование даты создания комментария
  useEffect(() => {
    if (commentData?.created_at) {
      const date = new Date(commentData.created_at);
      setCreateDate(
        date.toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
      );
    }
  }, [commentData]);
  const { t } = useTranslation();
  // Обработка данных пользователя
  const name =
    profileData?.first_name && profileData?.last_name
      ? `${profileData.first_name} ${profileData.last_name}`
      : `${t("default.name")} ${t("default.lastName")}`;
  useEffect(() => {
    setPhotoUrl(
      profileData?.photo
        ? `https://api.lr45981.tw1.ru${profileData.photo}`
        : channel,
    );
  }, [profileData?.photo]);

  // const profilesMap = Array.isArray(usersProfiles)
  //   ? usersProfiles.reduce(
  //       (
  //         acc: Record<number, IUsersProfiles>,
  //         profile: IUsersProfiles,
  //       ) => {
  //         acc[profile.user_id] = profile;
  //         return acc;
  //       },
  //       {},
  //     )
  //   : {};
  const toggleResponses = () => setOpenResponse(!openResponse);
  const toggleShowReply = () => {
    setShowReply(!showReply);
  };
  const textarea = document.getElementById("reply");
  if (showReply) {
    const autoGrow = (el: any) => {
      el.style.height = "5px";
      el.style.height = el.scrollHeight + "px";
    };

    if (textarea) {
      textarea.addEventListener("input", function () {
        autoGrow(this as HTMLElement);
      });
    }
  }
  function handleChange(
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) {
    setValue(event.target.value);
  }
  // const reply = document.getElementById("reply");
  const postReplyComment = async(text: string) => {
    await sendPlayerCommentReplies(commentData.id, text);
    setValue("");
    await getPlayerCommentsReplies(dispatch, commentData.id);
    await getPlayerComments(dispatch, +idLesson!);
    setShowReply(false);
    if (textarea) {
     textarea.style.height = "25px"; // Сбрасываем высоту textarea
    }
  };
  const cancelReply = () => {
    setValue("");
    setShowReply(false);
    setIsFocused(false);
  };
  return (
    <div className={s.wrapper}>
      <Link
        to={
          userData?.user_id === commentData?.user_id
            ? `/profile`
            : `/profile/${commentData.user_id}`
        }>
        <span className={s.round}>
          <img src={photoUrl} alt='profilePhotoComment' />
        </span>
      </Link>
      <div className={s.container}>
        <div className={s.nameInfoComment}>
          <h2 className={s.name}>{name}</h2>
          {/* <span className={s.view}>1000 просмотров</span> */}
          <span className={s.date}>{createDate}</span>
        </div>
        <p className={s.textComment}>{commentData.text}</p>
        <div className={s.buttons}>
          <button className={s.complaint}>
            {t("player.navigation.complaint")}
          </button>
          {playerData?.media_id &&
            commentData.user_id.toString() !==
              userData?.user_id.toString() && (
              <button className={s.reply} onClick={toggleShowReply}>
                {t("player.navigation.replyBtn")}
              </button>
            )}
        </div>
        {showReply && (
          <div className={s.CommentWrapper}>
            <div className={s.commentFieldContainer}>
              <textarea
                name='comment'
                id='reply'
                placeholder={t("player.navigation.replyText")}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}
                value={value}
                className={s.commentsField}
                maxLength={200}
              />
              <button
                className={s.sendComment}
                onClick={() => postReplyComment(value)}>
                {t("player.navigation.replySend")}
              </button>
              <span className={s.counterLetter}>
                {value.length > 0
                  ? `${value.length} / 200`
                  : "0 / 200"}
              </span>
            </div>
          </div>
        )}

        {commentData.reply_count > 0 && (
          <button className={s.responses} onClick={toggleResponses}>
            {openResponse
              ? `${t("player.navigation.close")}`
              : `${t("player.navigation.open")}`}{" "}
            {t("player.navigation.replies")} (
            {commentData.reply_count})
          </button>
        )}

        {openResponse && (
          <div className={s.responsesWrapper}>
            {replies.map(
              (reply: IPlayerCommentDataRepliesResults) => {
                const replyProfile = usersProfiles?.find(
                  (profile) => profile.user_id === reply.user_id,
                );
                const date =
                  reply && reply.created_at
                    ? new Date(reply.created_at).toLocaleDateString(
                        "ru-RU",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        },
                      )
                    : "01 января 2024г.";
                const replyName =
                  replyProfile?.first_name && replyProfile?.last_name
                    ? `${replyProfile.first_name} ${replyProfile.last_name}`
                    : `${t("default.name")} ${t("default.lastName")}`;

                const replyPhotoUrl = replyProfile?.photo
                  ? `https://api.lr45981.tw1.ru${replyProfile.photo}`
                  : "";

                return (
                  <div key={reply.id} className={s.responseComment}>
                    <Link
                      to={
                        userData?.user_id === reply.user_id
                          ? `/profile`
                          : `/profile/${reply.user_id}`
                      }>
                      <span className={s.roundResponse}>
                        <img
                          src={
                            replyPhotoUrl ? replyPhotoUrl : channel
                          }
                          alt='profilePhotoReply'
                        />
                      </span>
                    </Link>
                    <div className={s.responseCommentContainer}>
                      <div className={s.nameInfoComment}>
                        <h2 className={s.nameComment}>{replyName}</h2>
                        {/* <span className={s.view}>
                          1000 просмотров
                        </span> */}
                        <span className={s.date}>{date}</span>
                      </div>
                      <p className={s.textCommentResponse}>
                        {reply.text}
                      </p>
                      <button className={s.complaint}>
                        {t("player.navigation.complaint")}
                      </button>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        )}
      </div>
    </div>
  );
};
