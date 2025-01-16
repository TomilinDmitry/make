import { useState } from "react";
import styles from "./Inputs.module.scss";
import showIcon from "../../app/assets/profileCard/ShowIcon.svg";
import hideIcon from "../../app/assets/profileCard/NotShowIcon.svg";
import { InputFieldProps, InputsProps } from "app/types/type";
import { useSelector } from "app/service/hooks/hooks";
import "react-dadata/dist/react-dadata.css";
import "./style.css";
import {
  AddressSuggestions,
  DaDataAddress,
  DaDataSuggestion,
} from "react-dadata";
import { useTranslation } from "react-i18next";

const InputField: React.FC<InputFieldProps> = ({
  value,
  onChange,
  error,
  label,
  required = false,
  readOnly = false,
  isPassword = false,
  isVisible = true,
  onVisibilityToggle,
}) => {
  return (
    <div className={styles.group}>
      <input
        value={value}
        onChange={onChange}
        className={readOnly ? styles.inputRead : styles.input}
        type={isPassword && !isVisible ? "password" : "text"}
        required={required}
        readOnly={readOnly}
      />
      {isPassword && (
        <img
          src={isVisible ? hideIcon : showIcon}
          alt='icon'
          className={styles.showIcon}
          onClick={onVisibilityToggle}
        />
      )}
      <span className={styles.highlight}></span>
      <label className={readOnly ? styles.labelRead : styles.label}>
        {value === "" || value === null ? `${label}` : label}
      </label>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export const Inputs: React.FC<InputsProps> = ({
  onInputChange,
  initialShowPhone = true,
  initialShowTelegram = true,
  initialShowWhatsapp = true,
}) => {
  const { userData } = useSelector((state) => state.user);
  const name = userData?.first_name;
  const lastName = userData?.last_name;

  const [inputValues, setInputValues] = useState({
    first_name: name,
    last_name: lastName || "",
    city: userData?.city || null,
    country: userData?.country || null,
    telegram: userData?.telegram || "",
    phone: userData?.phone || "",
    whats_app: userData?.whats_app || "",
  });
  console.log(inputValues);
  const [showTelegram, setShowTelegram] = useState<boolean>(
    initialShowTelegram,
  );
  const [showWhatsapp, setShowWhatsapp] = useState<boolean>(
    initialShowWhatsapp,
  );
  const [showPhone, setShowPhone] =
    useState<boolean>(initialShowPhone);
  const { t } = useTranslation();

  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    city: "",
    phone: "",
  });

  const handleChange = (field: string, value: string | boolean) => {
    onInputChange(field, value);

    if (typeof value === "boolean") {
      if (field === "show_telegram") {
        setShowTelegram(value);
      } else if (field === "show_telephone") {
        setShowPhone(value);
      } else if (field === "show_whats_app") {
        setShowWhatsapp(value);
      }
    } else {
      setInputValues((prev) => ({ ...prev, [field]: value }));

      // setErrors((prev) => ({
      //   ...prev,
      //   [field]:
      //     value.trim() === "" ? "Поле не должно быть пустым!" : "",
      // }));
    }
  };
  const [valueCity, setValueCity] = useState<
    DaDataSuggestion<DaDataAddress> | undefined
  >(undefined);
  const handleSuggestionChange = (
    suggestion: DaDataSuggestion<DaDataAddress> | undefined,
  ) => {
    if (suggestion) {
      const country = suggestion.data.country;
      const city =
        suggestion.data.city ?? suggestion.data.region_with_type;

      handleChange("country", country);
      handleChange("city", city!);
    } else {
      handleChange("country", " ");
      handleChange("city", " ");
    }
  };
  return (
    <div className={styles.inputs_box}>
      {/* Имя */}
      <InputField
        value={userData?.first_name!}
        onChange={(e) => handleChange("first_name", e.target.value)}
        error={errors.first_name}
        label={t("profile.editProfileLabels.name")}
        required
        readOnly={name !== null}
      />

      {/* Фамилия */}
      <InputField
        value={lastName!}
        onChange={(e) => handleChange("last_name", e.target.value)}
        error={errors.last_name}
        label={t("profile.editProfileLabels.lastName")}
        required
        readOnly={lastName !== null}
      />

      {/* Телеграм */}
      <InputField
        value={inputValues.telegram}
        onChange={(e) => handleChange("telegram", e.target.value)}
        label='Telegram'
        isPassword
        isVisible={showTelegram}
        onVisibilityToggle={() => {
          const newValue = !showTelegram;
          setShowTelegram(newValue);
          handleChange("show_telegram", newValue);
        }}
      />
      <InputField
        value={inputValues.whats_app}
        onChange={(e) => handleChange("whats_app", e.target.value)}
        label='WhatsApp'
        isPassword
        isVisible={showWhatsapp}
        onVisibilityToggle={() => {
          const newValue = !showWhatsapp;
          setShowWhatsapp(newValue);
          handleChange("show_whats_app", newValue);
        }}
      />

      {/* Телефон */}
      <InputField
        value={inputValues.phone}
        onChange={(e) => handleChange("phone", e.target.value)}
        label={t("profile.editProfileLabels.number")}
        error={errors.phone}
        isPassword
        isVisible={showPhone}
        onVisibilityToggle={() => {
          const newValue = !showPhone;
          setShowPhone(newValue);
          handleChange("show_telephone", newValue);
        }}
      />
      {/* <div className={styles.dropdowns}> */}
      <div className={styles.cityGroup}>
        <label className={styles.city}>
          {t("profile.editProfileLabels.location")}
        </label>
        <AddressSuggestions
          token='bcbe8a79e4b94cc3270a0204684977965ab06020'
          value={valueCity}
          onChange={handleSuggestionChange}
          filterLocations={[{ country: "*" }]}
          selectOnBlur={true}
          filterToBound='city'
          filterRestrictValue={true}
          count={5}
          filterFromBound='city'
          defaultQuery={
            userData?.city && userData.country
              ? `${userData.country}, ${userData.city}`
              : "Россия,..."
          }
          containerClassName={styles.inputCountry}
        />
      </div>
    </div>
  );
};
