// react
import PropTypes from "prop-types";

// css
import styles from "./Input.module.css";

export default function Input({
  type,
  text,
  name,
  placeholder,
  handleOnChange,
  value,
}) {
  return (
    <div className={styles.form_control}>
      <label htmlFor={name}>{text}:</label>
      <input
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        onChange={handleOnChange}
        value={value}
        required
      />
    </div>
  );
}

Input.propTypes = {
  type: PropTypes.string,
  text: PropTypes.string,
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  placeholder: PropTypes.string,
  handleOnChange: PropTypes.func,
  value: PropTypes.string,
};

Input.defaultProps = {
  type: "text",
  value: "",
};
