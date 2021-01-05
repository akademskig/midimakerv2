import { useTheme,  } from '@material-ui/core'
import { useEffect, useState } from 'react'

export default function useScreenSize(){
    const theme = useTheme()
    const [width, setWidth ] = useState(window.innerWidth)
    const [isMobile, setIsMobile] = useState(width < theme.breakpoints.values.xs)
    const [isDesktop, setIsDesktop] = useState(width > theme.breakpoints.values.md)
    const [isTablet, setIsTablet] = useState(width < theme.breakpoints.values.sm && width >= theme.breakpoints.values.xs)
    
    useEffect(() => {
        const setScreenParam = () => {
            setWidth(window.innerWidth)
            setIsMobile(width <= theme.breakpoints.values.xs)
            setIsTablet(width <= theme.breakpoints.values.sm)
            setIsDesktop(width >= theme.breakpoints.values.md)
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
        isDesktop
    })
}