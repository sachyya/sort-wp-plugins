import styles from './Search.module.css'

export default function Search({...props}) {
    return(
        <input placeholder="Type and search..." className={styles.search} type='search' {...props} />
    )
}