import Image from 'next/image'
import React from 'react'

function Logo() {
  return (
    <Image 
    height={20}
    width={20}
    alt='Logo'
    src="/logo.svg"
    />
  )
}

export default Logo