// react
import PropTypes from "prop-types";

// css
import styles from "./Select.module.css";

export default function Select({ text, name, options, handleOnChange, value }) {
  return (
    <div className={styles.form_control}>
      <label htmlFor={name}>{text}:</label>
      <select name={name} id={name} onChange={handleOnChange} value={value}>
        <option>Escolha uma opção</option>
        {options.map((option) => (
          <option value={option.id} key={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}

Select.propTypes = {
  text: PropTypes.string,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleOnChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Permitindo string ou número
};

Select.defaultProps = {
  value: "",
};