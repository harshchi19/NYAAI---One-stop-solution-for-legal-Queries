import React from 'react';
import Navgate from './components/navigater';
import HeroBanner from './components/banner';
import './components/component.css'
import lm from './assets/match.png'
import lc from './assets/chatb.png'
import ld from './assets/doc.png'
import la from './assets/ai.png'
import Footer from './components/footer';
import ClickSpark from '../../components/cursor';
import UserBanner from './components/user';
import Features from './components/feature';
import InfiniteMenu from './components/Infinte'
import CircularGallery from './components/circularGallery';

const Landing = () => {

  const items = [
    {
      image: 'src/pages/landing/assets/purva.jpeg',
      link: 'https://www.linkedin.com/in/anushri-venkitaramanan-218a1228a/',
      title: (
        <>
          Purva
          <br />
          Vora
        </>
      ),
      description: 'Researcher and Designer'
    },
    {
      image: 'https://res.cloudinary.com/da3alyb5h/image/upload/v1743226722/harsh_w7gkhj.jpg',
      link: 'https://www.linkedin.com/in/harshchitaliya/',
      title: (
        <>
          Harsh
          <br />
          Chitaliya
        </>
      ),
      description: 'AI & ML Expert'
    },
    {
      image: 'src/pages/landing/assets/sumit.jpg',
      link: 'https://www.linkedin.com/in/arya-vaidya-1a9b28257/',
      title: (
        <>
          Sumit
          <br />
          Gohil
        </>
      ),
      description: 'App Developer and AR/VR Expert'
    },
    {
      image: 'https://res.cloudinary.com/da3alyb5h/image/upload/v1743226527/Satyavrat_kg4vyn.jpg',
      link: 'https://www.linkedin.com/in/satyavrat-tiwari/',
      title: (
        <>
          Satyavrat
          <br />
          Tiwari
        </>
      ),
      description: 'Full Stack Developer'
    },
    // {
    //   image: 'https://res.cloudinary.com/da3alyb5h/image/upload/v1743227128/480218279_1332734794438082_440814972770690952_n.jpg_blkkwa.jpg',
    //   link: 'https://www.linkedin.com/in/deep-jain-81230126a/',
    //   title: (
    //     <>
    //       Deep
    //       <br />
    //       Jain
    //     </>
    //   ),
    //   description: 'Full Stack Developer'
    // }
  ];
    
    return (
        <div className="landing">
        <ClickSpark
          sparkColor='#000'
          sparkSize={10}
          sparkRadius={35}
          sparkCount={8}
          duration={600}
        >
          <Navgate />
          <HeroBanner />
          <UserBanner />
          <Features />
          <div className='case-title' style={{marginTop:"50px"}}>Want more use cases? </div>
          <div style={{ height: '600px', position: 'relative' }}>
          <CircularGallery bend={0} textColor="#000" borderRadius={0.05} />
          </div>
          <div className='case-title' style={{marginTop:"50px"}}>Our Team </div>
          <div style={{ height: '600px', position: 'relative', margin:'10px' }}>
            <InfiniteMenu items={items}/>
          </div>
          
           <Footer />
          </ClickSpark>
  
          </div>

    );
};

export default Landing;