import React, { FC } from 'react'

interface ContainerProp {
  children: React.ReactNode,
  className?: string
}

const Container: React.FC<ContainerProp> = ({children, className}) => {
  return (
    <div className={`${className} max-w-[1200px] mx-auto`}>{children}</div>
  )
}

export default Container