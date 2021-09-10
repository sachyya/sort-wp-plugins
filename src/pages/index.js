import Layout from '../components/Layout/Layout'
import Search from '../components/Search/Search'
import styles from '../styles/Home.module.scss'

import moment from 'moment'
import { useState } from "react"
import axios from 'axios'
import { debounce } from "debounce";
import Plugin from '../components/Plugin/Plugin'
import { KeyboardArrowDown, KeyboardArrowUp, Grade } from '@material-ui/icons'

const SortArrow = ({direction}) => {
    if(!direction) {
        return (
            <div className={styles.heading_arrow}>
                {/* <Sort color="inherit"/> */}
            </div>
        )
    }

    if( direction === 'desc' ) {
        return (
            <div className={styles.heading_arrow}>
                <KeyboardArrowDown color="inherit"/>
            </div>
        )
    } else {
        return (
            <div className={styles.heading_arrow}>
                <KeyboardArrowUp color="inherit"/>
            </div>
        ) 
    }
}

const orderBy = ( plugins, direction, sortby ) => {
    return [...plugins].sort( (a, b) => {
    if( direction === 'asc' ) {
        if( sortby === 'ratings' ) {
            return a.ratings[5] > b.ratings[5] ? 1 : -1
        } else if( sortby === 'last_updated' ) {
            return moment( a.last_updated, 'YYYY-MM-DD hh:mma GMT' ) > moment( b.last_updated, 'YYYY-MM-DD hh:mma GMT' ) ? 1 : -1
        } else {
            return a[sortby] > b.[sortby] ? 1 : -1
        }
    } else if( sortby === 'ratings' ) {
            return a.ratings[5] > b.ratings[5] ? -1 : 1
        } else if( sortby === 'last_updated' ) {
            return moment( a.last_updated, 'YYYY-MM-DD hh:mma GMT' ) > moment( b.last_updated, 'YYYY-MM-DD hh:mma GMT' ) ? -1 : 1
        } else {
            return a[sortby] > b.[sortby] ? -1 : 1
        }
    }
)}

export default function Home() {
    const [keyword, setKeyword] = useState()
    const [plugins, setPlugins] = useState([])
    const [direction, setDirection] = useState('')
    const [sortby, setSortby] = useState()

    const onSearch = (e) => {
        e.preventDefault()
        setKeyword(e.target.value)

        const plugins = axios.get(`https://api.wordpress.org/plugins/info/1.2/?action=query_plugins&request[search]=${e.target.value}` ).then((res) => {
            setPlugins(res.data.plugins)
        })
    }

    const switchDirection  = () => {
        if(!direction) {
            setDirection('desc')
        } else if( direction === 'desc' ) {
            setDirection('asc')
        } else {
            setDirection(null)
        }
    }

    const setSortbyAndDirection = ( value ) => {
        switchDirection()
        setSortby(value)
    }
    
    const orderedPlugins = orderBy(plugins, direction, sortby)

    return (
        <Layout>
            <Search onChange={ debounce(onSearch,300)} ></Search>
            
            <ul className={styles.listWrapper}>
                <li>Name</li>
                <li>
                    <button onClick={() => setSortbyAndDirection('ratings')} >
                        <Grade color="inherit"/>
                        <Grade color="inherit"/>
                        <Grade color="inherit"/>
                        <Grade color="inherit"/>
                        <Grade color="inherit"/>
                        {sortby == 'ratings' && <SortArrow direction={direction}/>}
                    </button>
                </li> 
                <li>
                    <button onClick={() => setSortbyAndDirection('active_installs')} >
                        Active Installs
                        {sortby == 'active_installs' && <SortArrow direction={direction}/>}
                    </button>
                </li>
                <li>
                    <button onClick={() => setSortbyAndDirection('last_updated')} >
                        Last Updated
                        {sortby == 'last_updated' && <SortArrow direction={direction}/>}
                    </button>
                </li>
                <li>
                    <button onClick={() => setSortbyAndDirection('support_threads_resolved')} >
                        Support Resolved
                        {sortby == 'support_threads_resolved' && <SortArrow direction={direction}/>}
                    </button>
                </li>
            </ul>

            { (keyword) && ( 
                Array.isArray(orderedPlugins)
                    && ( orderedPlugins.length > 1 ) ? orderedPlugins.map(plugin => {
                    return <Plugin plugin={plugin} />
                    }) : <h2 className={styles.message} >No plugins found</h2>
                )
            }

        </Layout>
    )
}
