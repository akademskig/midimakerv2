import { useTheme } from '@mui/material'
import { useEffect, useState } from 'react'

export default function useScreenSize(){
    const theme = useTheme()
    const [width, setWidth ] = useState(window.innerWidth)
    const [height, setHeight ] = useState(window.innerHeight)
    const [isMobile, setIsMobile] = useState(width < theme.breakpoints.values.xs)
    const [isDesktop, setIsDesktop] = useState(width > theme.breakpoints.values.md)
    const [isTablet, setIsTablet] = useState(width < theme.breakpoints.values.sm && width >= theme.breakpoints.values.xs)
    useEffect(() => {
        const setScreenParam = () => {
            setHeight(window.innerHeight)
            setWidth(window.innerWidth)
            setIsMobile(window.innerWidth <= theme.breakpoints.values.xs)
            setIsTablet(window.innerWidth <= theme.breakpoints.values.sm)
            setIsDesktop(window.innerWidth > theme.breakpoints.values.md)
        }
        window.addEventListener('resize', setScreenParam)
        setScreenParam()
        return () => {
            window.removeEventListener('resize', setScreenParam)
        }
    }, [setWidth, setIsMobile, theme, width, setIsTablet, isTablet ])

   return ({ 
        width,
        isMobile,
        isTablet,
        isDesktop,
        height
    })
}