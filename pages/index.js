import { useState, useEffect } from "react";
import { readFileFromIPFS } from "@/components/pinata";
import 'sf-font';
import { pinatajwt } from "@/components/config";

export default function Home() {
  const [listings, getListings] = useState([]);

  useEffect(() => {
    fetchListings();
  },[])

  async function fetchListings() {
    const array = await readFileFromIPFS();
    console.log(array);
    getListings(array)
  }

  return (
    <div>
    {listings.map((list, i) => (
    <div key={i}>
      <div className="container px-4 py-5">

    <h2 key={i} className="pb-2 border-bottom fw-bold">{list.Title}</h2>
    <div className="row row-cols-1 row-cols-md-2 align-items-md-center g-5 py-5">
      <div className="col d-flex flex-column align-items-start gap-2">
      <div className="col">
        <div className="card overflow-hidden rounded-4 shadow-lg" >
          <div className="d-flex flex-column p-3 pb-0 text-shadow-1">
            <img className="overflow-hidden  rounded-4 shadow-lg" src={list.Picture + pinatajwt} style={{maxWidth:'500px', maxHeight:'500px'}}/>
            <ul className="d-flex list-unstyled mt-auto">
              <li className="d-flex align-items-center me-1 mt-1">
              <img src="map-solid.svg" alt="twbs" width="30" height="30" className="flex-shrink-0"/>
              </li>
              <li className="d-flex align-items-center me-2 mt-2">
                <h6 style={{color:'black'}}>{list.Address}</h6>
              </li>
              <li className="d-flex align-items-center me-1 mt-2">
                <h6 style={{color:'black'}}>{list.City}</h6>
              </li>
              <li className="d-flex align-items-center me-1 mt-2">
                <h6 style={{color:'black'}}>{list.City}</h6>
              </li>
              <li className="d-flex align-items-center me-1 mt-2">
                <h6 style={{color:'black'}}>{list.Country}</h6>
              </li>
              <li className="d-flex align-items-center me-1 mt-2">
                <h6 style={{color:'black'}}>{list.Zip}</h6>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="row row-cols-2 row-cols-md-2 ">
  <a className="list-group-item list-group-item-action d-flex gap-3 py-4" aria-current="true">
    <img src="dollar-solid.svg" alt="twbs" width="32" height="32" className="flex-shrink-0"/>
    <div className="d-flex gap-2 w-100 justify-content-between">
      <div>
        <h5 className="mb-0">{list.Price}</h5>
      </div>
    </div>
  </a>
  <a className="list-group-item list-group-item-action d-flex gap-2 py-1" aria-current="true">
    <div className="d-flex gap-4 justify-content-between">
      <div>
        <h6 className="mb-0">Seller: {list.Name}<img src="person-solid.svg" alt="twbs" width="20" height="20" className="flex-shrink-0"/></h6>
      </div>
      <div>
        <h6 className="mb-0">{list.Email}<img src="at-solid.svg" alt="twbs" width="20" height="20" className="flex-shrink-0" style={{marginLeft:'2px'}}/></h6>
      </div>
      <div>
        <h6 className="mb-0">{list.Phone}<img src="phone-solid.svg" alt="twbs" width="20" height="20" className="flex-shrink-0" style={{marginLeft:'2px'}}/></h6>
      </div>
    </div>
  </a>
  <a className="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
  <img src="calendar-solid.svg" alt="twbs" width="32" height="32" className="flex-shrink-0"/>
    <div className="d-flex gap-2 w-100 justify-content-between">
      <div>
        <h5 className="mb-0">Listed since: {list.Listed}</h5>
      </div>
    </div>
  </a>
  </div>

      </div>
      <div className="col">
        <div className="row row-cols-sm-2 g-4">

        <div className="col d-flex flex-column gap-2">
          <div className="feature-icon-small d-inline-flex align-items-center  bg-gradient fs-4 rounded-3">
          <img src='house-solid.svg' width="32" height="32" style={{marginRight:'4px'}}/>
            <h4 className="fw-semibold">Floors {list.Floors}</h4>
            </div>
          </div>

          <div className="col d-flex flex-column gap-2">
          <div className="feature-icon-small d-inline-flex align-items-center  bg-gradient fs-4 rounded-3">
          <img src='build-solid.svg' width="32" height="32" style={{marginRight:'4px'}}/>
            <h4 className="fw-semibold">Built {list.Year}</h4>
            </div>
          </div>

          <div className="col d-flex flex-column gap-2">
            <div className="feature-icon-small d-inline-flex align-items-center  bg-gradient fs-4 rounded-3">
            <img src='bed-solid.svg' width="32" height="32" style={{marginRight:'4px'}}/>
            <h4 className="fw-semibold">Beds {list.Rooms}</h4>
            </div>
          </div>

          <div className="col d-flex flex-column gap-2">
          <div className="feature-icon-small d-inline-flex align-items-center  bg-gradient fs-4 rounded-3">
          <img src='bath-solid.svg' width="32" height="32" style={{marginRight:'4px'}}/>
            <h4 className="fw-semibold">Baths {list.Baths}</h4>
            </div>
          </div>

          <div className="col d-flex flex-column gap-2">
          <div className="feature-icon-small d-inline-flex align-items-center  bg-gradient fs-4 rounded-3">
          <img src='garage-solid.svg' width="32" height="32" style={{marginRight:'4px'}}/>
            <h4 className="fw-semibold">Garage {list.Garage}</h4>
            </div>
          </div>

          <div className="col d-flex flex-column gap-2">
          <div className="feature-icon-small d-inline-flex align-items-center  bg-gradient fs-4 rounded-3">
          <img src='dollar-solid.svg' width="32" height="32" style={{marginRight:'4px'}}/>
            <h4 className="fw-semibold">HOA ${list.Hoa}</h4>
            </div>
          </div>
        </div>
        <div className="col d-flex flex-column py-5">
        <p>{list.Info}
        </p>
        </div>
      </div>
    </div> 
  </div>
    <div className="b-example-divider"></div>
    </div>
        ))}
   </div>
  )
}
