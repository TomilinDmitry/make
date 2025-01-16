import React, { useRef, useState } from "react";
import s from "./complaintModal.module.scss";
import { ComplaintElement } from "./ListElement/ComplaintElement";
import { useDispatch, useSelector } from "app/service/hooks/hooks";
import {
  setComplaintOpen,
  setOpenPostComplaintModal,
} from "app/service/lessons/lessonsSlice";
import complaint from "../../../app/assets/lessons/ComplaintBlack.svg";
import close from "../../../app/assets/lessons/ConditionCloseIcon.svg";
import { postComplaint } from "app/api/apiLessons";
import { toast } from "react-toastify";
export const ComplaintModal = ({ id }: { id: number }) => {
  const complaintList = [
    {
      id: 1,
      type: "inappropriate",
      title: "Неподходящий контент",
    },
    {
      id: 2,
      type: "pornography",
      title: "Порнография",
    },
    {
      id: 3,
      type: "violence",
      title: "Насилие",
    },
    {
      id: 4,
      type: "copyright",
      title: "Нарушение авторских прав",
    },
    {
      id: 5,
      type: "other",
      title: "Другое",
    },
  ];
  const { postComplaintModal, openComplaint } = useSelector(
    (state) => state.lessons,
  );
  console.log(id);
  const [selectedComplaint, setSelectedComplaint] = useState<{
    id: number;
    type: string;
    title: string;
  } | null>(null);

  // Обработчик выбора жалобы
  const handleComplaintClick = (el: {
    id: number;
    type: string;
    title: string;
  }) => {
    setSelectedComplaint(el);
  };
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("");
  const handleInputText = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setText(event.target.value); // Обновляем состояние
    console.log("Текущий текст:", event.target.value); // Выводим текст
  };
  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Сброс высоты
      textarea.style.height = `${textarea.scrollHeight}px`; // Установка высоты на основе содержимого
    }
  };
  const dispatch = useDispatch();
  const postComplaintMessage = async () => {
    if (selectedComplaint?.type) {
      await postComplaint(id, selectedComplaint?.type, text);
    }
    dispatch(setComplaintOpen(false));
    dispatch(setOpenPostComplaintModal(false));
    toast.success("Ваша жалоба передана на рассмотрение.");
  };
  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        {!postComplaintModal ? (
          <div className={s.box}>
            <div className={s.iconContainer}>
              <img
                src={close}
                alt='CloseIcon'
                onClick={() => dispatch(setComplaintOpen(false))}
              />
            </div>
            <section className={s.topBlock}>
              <h1 className={s.title}>Что не так с этим уроком?</h1>
            </section>
            <ul className={s.list}>
              {complaintList.map((el) => (
                <ComplaintElement
                  title={el.title}
                  type={el.type}
                  key={el.id}
                  onClick={() => handleComplaintClick(el)}
                />
              ))}
            </ul>
          </div>
        ) : (
          postComplaintModal && (
            <div className={s.secondModal}>
              <div className={s.iconContainer}>
                <img
                  src={close}
                  alt='CloseIcon'
                  onClick={() =>
                    dispatch(setOpenPostComplaintModal(false))
                  }
                />
              </div>
              <section className={s.topBlock}>
                <h1 className={s.title}>
                  {selectedComplaint?.title}
                </h1>
              </section>
              <div className={s.box}>
                <div className={s.imageBlock}>
                  <img src={complaint} alt='' />
                </div>
                <div className={s.inputContainer}>
                  <textarea
                    ref={textareaRef}
                    className={s.complaintInput}
                    onInput={handleInput}
                    value={text}
                    onChange={handleInputText}
                  />{" "}
                  <span></span>
                </div>
                <span className={s.help}>
                  Помогите нам: расскажите, что не так с этим уроком.
                </span>
                <div className={s.buttonContainer}>
                  <button
                    className={s.button}
                    onClick={postComplaintMessage}>
                    <span>Пожаловаться</span>
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
