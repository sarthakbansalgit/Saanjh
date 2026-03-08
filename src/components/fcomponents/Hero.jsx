import React from 'react'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <>


      <section id="hero" class="d-flex align-items-center">

        <div class="container">
          <div className="row gy-4">
            <div className="col-lg-6 order-2 order-lg-1 d-flex flex-column justify-content-center">
              <h1 style={{ color: "#800000", fontFamily: "'Georgia', serif" }}>Milaap Deya Raahan: Find Your Perfect Desi Match</h1>
              <h2 style={{ color: "#b07d0b", fontWeight: "600", fontStyle: "italic" }}>Kyonki har Sanjog sachchi niyat naal jureya hunda hai! Join India's most trusted Punjabi Matrimony.</h2>
              <div style={{ marginTop: "20px" }}>
                <Link to="/signup" className="btn-get-started scrollto" style={{ background: "linear-gradient(45deg, #d4418e, #0652c5)", border: "none", padding: "12px 30px", fontSize: "18px", boxShadow: "0 6px 15px rgba(212, 65, 142, 0.4)", borderRadius: "30px" }}>Start Your Rishta Journey</Link>
              </div>
            </div>
            <div className="col-lg-6 order-1 order-lg-2 hero-img" style={{ display: "flex", justifyContent: "center" }}>
              <img src={process.env.PUBLIC_URL + "/assets/img/hero-desi.png"} className="img-fluid animated" alt="Punjabi Couple Anand Karaj illustration" style={{ borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", maxWidth: "80%" }} />
            </div>
          </div>
        </div>

      </section>



    </>
  )
}

export default Hero