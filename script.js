'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav=document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach( function(btn) {
  btn.addEventListener('click', openModal);
});

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//implementing smooth scrolling
//button(learn more)
const btnScrollTo=document.querySelector('.btn--scroll-to');
//section to scroll to
const section1=document.querySelector('#section--1');

btnScrollTo.addEventListener('click',function(e) {

  //getting coordinates to where we have to scroll
  const coords=section1.getBoundingClientRect();  

  //coordinates of button
  console.log(e.target.getBoundingClientRect());

  //current scroll position
  console.log('Current X,Y:',window.pageXOffset,window.pageYOffset);

  //scrolling(this is scroll instantly)
  // window.scrollTo(coords.left + window.pageXOffset,coords.top + window.pageYOffset);

  //scrolling smoothly(OLD SCHOOL WAY)
  // window.scrollTo({
  //   left : coords.left + window.pageXOffset,
  //   top : coords.top + window.pageYOffset,
  //   behavior : 'smooth' 
  // })

  //scrolling smoothly(MODERN WAY)
 section1.scrollIntoView({behavior : 'smooth'});

})

//page navigation(without event delegation)
// document.querySelectorAll('.nav__link').forEach(function(el){     //this is return a node list
//   el.addEventListener('click',function(e){            //we can apply event listener to all using ForEach
//     e.preventDefault();
//     const id=this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({behavior:'smooth'})
//   })
// })

//page navigation(with event delegation)
document.querySelector('.nav__links').addEventListener('click',function(e){
  e.preventDefault();
  
  //matching strategy
  if(e.target.classList.contains('nav__link')){

      const id=e.target.getAttribute('href');
      // console.log(id);
      document.querySelector(id).scrollIntoView({behavior:'smooth'})
  }
})

//tabbed components
const tabs=document.querySelectorAll('.operations__tab');
const tabsContainer=document.querySelector('.operations__tab-container');
const tabsContent=document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click',function(e){
  const clicked=e.target.closest('.operations__tab');

  //guard clause(this prevents anything after this to happen if condition is false)
  if(!clicked) return;   //(this is to fix whenever we click anywhere in container except the buttons we were getting error)

  //Remove active classes
  //move the seleted tab appear outward(operations__tab-active)
  tabs.forEach(t => t.classList.remove('operations__tab--active'));   //if one tab is selected others should come down
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //Activated tab
  clicked.classList.add('operations__tab--active');

  //Active content area
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
})

//menu fade animation

const Handlehover=function(e){
  if(e.target.classList.contains('nav__link')){
      const link=e.target;
      const siblings=link.closest('.nav').querySelectorAll('.nav__link');
      const logo=link.closest('.nav').querySelector('img');

      siblings.forEach(el => {
        if(el !== link)
          el.style.opacity=this;
      });
      logo.style.opacity=this;
  }
}

//passing arguments into handler
nav.addEventListener('mouseover',Handlehover.bind(0.5));  //bind functions returns a copy of that function

nav.addEventListener('mouseout',Handlehover.bind(1));
//bind sets the this keyword to 0.5 and 1 respectively

//sticky navigation
// const initialCoor=section1.getBoundingClientRect();   

// window.addEventListener('scroll', function(){
//   if(window.scrollY > initialCoor.top)
//     nav.classList.add('sticky');
//   else
//     nav.classList.remove('sticky');
// })

//Sticky navigation : Intersection Observer API
const header=document.querySelector('.header');
const navHeight=nav.getBoundingClientRect().height;

const stickyNav=function(entries) {
  const [entry]=entries;
  if(!entry.isIntersecting)
    nav.classList.add('sticky');
  else
    nav.classList.remove('sticky');
}

const headerObserver=new IntersectionObserver(stickyNav,{root:null,threshold:0,rootMargin:`-${navHeight}px`});
headerObserver.observe(header);

//Reveal sections on scroll
const allSections=document.querySelectorAll('.section');

const revealSection=function(entries,observer){
  const [entry]=entries;

  if(!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}

const sectionObserver=new IntersectionObserver(revealSection,{root:null,threshold:0.15});
allSections.forEach(function(section){
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
})

//lazy load images
const imgTargets=document.querySelectorAll('img[data-src]');
const loadImg=function(entries,observer) {
  const [entry]=entries;

  if(!entry.isIntersecting) return;

  //replacing src with data-src
  entry.target.src=entry.target.dataset.src;

  entry.target.addEventListener('load',function(){
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver=new IntersectionObserver(loadImg,{root:null,threshold:0,rootMargin:'-200px'});
imgTargets.forEach(img=>imgObserver.observe(img));

//Slider
const slides=document.querySelectorAll('.slide');
const btnLeft=document.querySelector('.slider__btn--left');
const btnRight=document.querySelector('.slider__btn--right');
const dotContainer=document.querySelector('.dots');   //dots at the bottom of slider

let curSlide=0;
const maxSlide=slides.length;

const createDots=function(){
  slides.forEach(function(_,i){
    dotContainer.insertAdjacentHTML('beforeend',`<button class="dots__dot" data-slide="${i}"></button>`);
  })
}
createDots();

const activateDot=function(slide){
  document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));

  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
}
activateDot(0);

const gotoSlide=function(slide) {
  slides.forEach((s,i) => (s.style.transform=`translateX(${100*(i-slide)}%)`));
};
gotoSlide(0);

//next slide
const nextSlide=function(){
    if(curSlide==maxSlide-1)
      curSlide=0;
    else
      curSlide++;
    gotoSlide(curSlide);
    activateDot(curSlide);
};

//previous slide
const prevSlide=function(){
  if(curSlide==0)
    curSlide=maxSlide-1;
  else
  curSlide--;
  gotoSlide(curSlide);
  activateDot(curSlide);
}

btnRight.addEventListener('click',nextSlide);
btnLeft.addEventListener('click',prevSlide);

//left right arrow key functionality
document.addEventListener('keydown',function(e){
  if(e.key==='ArrowLeft')
    prevSlide();
  else if(e.key==='ArrowRight')
    nextSlide();
})

//dots functionality
dotContainer.addEventListener('click',function(e){
  if(e.target.classList.contains('dots__dot')){
      const {slide}=e.target.dataset;     //same as const slide=e.target.dataset.slide(destructuring);
      gotoSlide(slide);
      activateDot(slide);
    }
})
