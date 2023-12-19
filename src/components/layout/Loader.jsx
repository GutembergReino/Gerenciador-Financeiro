// css
import styles from "./Loader.module.css";
import loading from "../../img/loading.svg";

export default function Loader() {
    return (
        <div className={styles.loader_container}>
            <img src={loading} alt="Loading" className={styles.loader} />
        </div>
    );
}