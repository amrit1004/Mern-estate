import React from 'react'

export default function CreateListing() {
  return (
    <main className='max-w-4xl p-3 mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
        <form className='flex flex-col gap-4 sm:flex-row'>
            <div className="flex flex-col flex-1 gap-4">
                <input type="text"  placeholder='Name' className='p-3 border rounded-lg ' id='name' max='62' minLength= '10' required/>
                <input type="text"  placeholder='Description' className='p-3 border rounded-lg ' id='description' required/>
                <input type="text"  placeholder='Address' className='p-3 border rounded-lg ' id='address' required/>
                <div className="flex flex-wrap gap-6">
                    <div className="flex gap-2">
                        <input type="checkbox" id="sale" className='w-5' />
                        <span>Sell</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="rent" className='w-5' />
                        <span>Rent</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="parking" className='w-5' />
                        <span>Parking Spot</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="furnished" className='w-5' />
                        <span>Furnished</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="offer" className='w-5' />
                        <span>Offer</span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                    <input type="number" className="p-3 border rounded-lg borde-gray-300"id='bedrooms' min='1' max='10' required />
                    <p>Beds</p>
                </div>
                <div className="flex items-center gap-2">
                    <input type="number" className="p-3 border rounded-lg borde-gray-300"id='bathrooms' min='1' max='10' required />
                    <p>Baths</p>
                </div>
                <div className="flex items-center gap-2">
                    <input type="number" className="p-3 border rounded-lg borde-gray-300"id='regularPrice' min='1' max='10' required />
                    <div className="flex flex-col items-center">
                    <p>Regular Price</p>
                    <span className='text-xs'>($ / Month)</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <input type="number" className="p-3 border rounded-lg borde-gray-300"id='discountPrice' min='1' max='10' required />
                    <div className="flex flex-col items-center">
                    <p>Discounted Price</p>
                    <span className='text-xs'>($ / Month)</span>
                    </div>
                </div>
            </div>
        </div>
        <div className='flex flex-col flex-1 gap-4'>
            <p className='font-semibold'>Images
            <span className='ml-2 font-normal text-gray-600'>The first image will be the cover (max6)</span></p>
             <div className='flex gap-4'>
                <input  className ="w-full p-3 border border-gray-300 rounded "type="file" id='images' accept='image/* ' multiple />
                <button className='p-3 text-green-700 uppercase border border-green-700 rounded hover:shadow-lg disabled:opacity-80'>Upload</button>
             </div>
        <button className='p-3 text-white uppercase rounded-lg bg-slate-700 hover:opacity-95 disabled:opacity-80 '>Create Listing</button>
        </div>
        </form>
    </main>
  )
}