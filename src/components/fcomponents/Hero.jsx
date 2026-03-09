import React from 'react'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <>


      <section id="hero" class="d-flex align-items-center">

        <div class="container">
          <div className="row gy-4">
            <div className="col-lg-6 order-2 order-lg-1 d-flex flex-column justify-content-center">
              <h1>Milaap Deya Raahan: Find Your Perfect Desi Match</h1>
              <h2>Kyonki har Sanjog sachchi niyat naal jureya hunda hai! Join India's most trusted Punjabi Matrimony.</h2>
              <div>
                <Link to="/signup" className="btn-get-started scrollto">Start Your Rishta Journey</Link>
              </div>
            </div>
            <div className="col-lg-6 order-1 order-lg-2 hero-img">
              <img src={process.env.PUBLIC_URL + "/assets/img/hero-desi.png"} className="img-fluid animated" alt="Punjabi Couple Anand Karaj illustration" style={{ borderRadius: "20px" }} />
            </div>
          </div>
        </div>

      </section>



    </>
  )
}

export default Hero