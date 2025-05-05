import React from 'react'
import HeaderGuide from "../guide/HeaderGuide"
import UseUserStore from "../Store/UseUserStore"

const GuideHome = () => {
  const { user } = UseUserStore();

  return (
    <>
       <HeaderGuide name={"bonjour " + user.name}/>
    </>
  )
}

export default GuideHome