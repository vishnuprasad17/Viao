import { Button, Input, Typography } from '@material-tailwind/react'


const SubsribeCard = () => {
  return (
    <div className="pb-5 p-10 md:pt-10">
    <div className="container flex flex-col mx-auto items-center justify-center h-full">
      <div className="relative flex !w-full py-10 mb-5 md:mb-20 container max-w-6xl mx-auto rounded-2xl p-5 bg-[url('/imgs/bg-6.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-blue-900 opacity-90 rounded-2xl"></div>
        <div className="relative  flex flex-col items-center justify-center text-center text-white w-full">
          <Typography className="text-2xl md:text-3xl font-bold" color="white"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            Become a Part of Our Tribe!
          </Typography>
          <Typography className="md:w-7/12 my-3 text-base" color="white"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          🚀 Get the latest news and updates every week, right in your inbox!
          We promise, no spam—just pure value! 💌
          </Typography>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 md:flex-row">
            <div className="w-60 md:w-80 lg:w-80 xl:w-80">
              <Input label="Email" color="white" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined} />
            </div>
            <Button size="md" className="lg:w-32" fullWidth color="yellow"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  

       
   
  )
}

export default SubsribeCard