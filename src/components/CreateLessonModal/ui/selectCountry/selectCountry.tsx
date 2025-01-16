import React, { useState } from "react";
import russia from "../../../../app/assets/createLessonModal/Russia.svg";
import uk from "../../../../app/assets/createLessonModal/UkActive.svg";

// Интерфейс для изображения (опционально)
import s from "./selectCountry.module.scss";
interface ImageOption {
  src: string;
  alt: string;
}

export const SelectCountry = () => {
  // Состояние для хранения выбранных изображений
  const [, setSelectedImages] = useState<string[]>([]);

  const images: ImageOption[] = [
    { src: russia, alt: "Russia" },
    { src: uk, alt: "UK" },
  ];

  const toggleSelect = (alt: string) => {
    setSelectedImages((prevSelected) =>
      prevSelected.includes(alt)
        ? prevSelected.filter((item) => item !== alt)
        : [...prevSelected, alt],
    );
  };

  return (
    <div>
      <span className={s.imageContainer}>
        {images.map((image) => (
          <img
            key={image.alt}
            src={image.src}
            alt={image.alt}
            onClick={() => toggleSelect(image.alt)}
            className={`${s.image}`}
          />
        ))}
      </span>
    </div>
  );
};
