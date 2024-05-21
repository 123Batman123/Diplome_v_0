import axios from "axios"
import { useEffect, useState } from "react"
import axiosInstance from "../services/API"

// const [data, setData] = useState<TypeFile[]>([])

//     useEffect(()=>{
//         axiosInstance.get<TypeFile[]>('http://127.0.0.1:8000/api/v1/filelist/', {
//             headers: {
//                 'Authorization': 'Token ec8b14a78bbe6034f51d68dc5e104806c13a7842'
//             }
//         })
//         .then( files => {
//             setData(files.data)
            
//         })
//     }, [])

//     console.log(`ОТВЕТ ${data.map(i => (i))}`)

//     const handleClick = () => {
//         axios.get<TypeFile[]>('http://127.0.0.1:8000/api/v1/filelist/', {
//             headers: {
//                 'Authorization': 'Token ec8b14a78bbe6034f51d68dc5e104806c13a7842'
//             }
//         })
//         .then( files => {
//             // setData(files)
//             console.log(`ОТВЕТ ${files.data[0].comment}`)
//         })
//     }