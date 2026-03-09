import React from 'react'
import aboutImage from './fimages/about2.png'

const About = () => {
  return (
    <>

      <section id="about" class="about">
        <div class="container">

          <div class="row justify-content-between">
            <div class="col-lg-5 d-flex align-items-center justify-content-center about-img">
              <img src={aboutImage} class="img-fluid" alt="" data-aos="zoom-in" />
            </div>
            <div className="col-lg-6 pt-5 pt-lg-0">
              <h3 data-aos="fade-up">Kyon Chuniye Saanjh Nu?</h3>
              <p data-aos="fade-up" data-aos-delay="100">
                Saanjh is deeply rooted in our rich Punjabi culture. It's built to unite families, honor our paramparik traditions, and connect true hearts seeking their Rab Ne Bana Di Jodi.
              </p>
              <div className="row">
                <div className="col-md-6" data-aos="fade-up" data-aos-delay="100">
                  <i className="bx bx-receipt"></i>
                  <h4>Khandani Verification</h4>
                  <p>Rest assured, every profile is meticulously verified to ensure you meet genuine families from respectable backgrounds.</p>
                </div>
                <div className="col-md-6" data-aos="fade-up" data-aos-delay="200">
                  <i className="bx bx-cube-alt"></i>
                  <h4>Asli Success Stories</h4>
                  <p>Read the beautiful safarnamas of couples who met on Saanjh and celebrated a mesmerizing Anand Karaj through our platform.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

    </>
  )
}

export default About