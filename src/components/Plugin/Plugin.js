import styles from './Plugin.module.scss'
import Link from 'next/link';

export default function Plugin({plugin}) {
    return (
        <ul className={styles.listWrapper} key={plugin.name}>
            <li><a rel="noreferrer" target="_blank" href={`https://wordpress.org/plugins/${plugin.slug}`}>{plugin.name}</a></li>
            <li>{plugin.ratings[5].toLocaleString()}</li>
            <li>{plugin.active_installs.toLocaleString()}</li>
            <li>{plugin.last_updated}</li>
            <li>{plugin.support_threads_resolved}</li>
        </ul>
    )
}