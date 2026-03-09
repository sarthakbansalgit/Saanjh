import React from 'react'
import success1 from './fimages/success1.jpg'
import success2 from './fimages/success2.jpg'
import success3 from './fimages/success3.jpg'
import success4 from './fimages/sanika.jpg'
import success5 from './fimages/success5.jpg'
import success6 from './fimages/success6.jpg'






const Success = () => {
    return (
        <>

            <div className="container" id='success'>

                <h1 className='text-center my-5 success-title'>Saanjh diyan Success Stories</h1>

                <div className="container text-center">
                    <div className="row gy-4">
                        <div className="col-sm">
                            <div className="card shadow-sm border-0" style={{ borderRadius: "15px", overflow: "hidden" }}>
                                <img className="card-img-top" src={success1} alt="Card cap" />
                                <div className="card-body" style={{ backgroundColor: "#fffdf9" }}>
                                    <h5 className="card-title" style={{ color: "#800000", fontWeight: "bold" }}>Manjit & Harpreet</h5>
                                    <p style={{ fontStyle: "italic", color: "#666" }}>"Waheguru di mehar naal, Saanjh helped our families connect perfectly."</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="card shadow-sm border-0" style={{ borderRadius: "15px", overflow: "hidden" }}>
                                <img className="card-img-top" src={success2} alt="Card cap" />
                                <div className="card-body" style={{ backgroundColor: "#fffdf9" }}>
                                    <h5 className="card-title" style={{ color: "#800000", fontWeight: "bold" }}>Diljit & Simran</h5>
                                    <p style={{ fontStyle: "italic", color: "#666" }}>"Our rishta felt so natural. Thank you for making our dreamy Punjabi wedding a reality."</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="card shadow-sm border-0" style={{ borderRadius: "15px", overflow: "hidden" }}>
                                <img className="card-img-top" src={success3} alt="Card cap" />
                                <div className="card-body" style={{ backgroundColor: "#fffdf9" }}>
                                    <h5 className="card-title" style={{ color: "#800000", fontWeight: "bold" }}>Ranbir & Jasmeet</h5>
                                    <p style={{ fontStyle: "italic", color: "#666" }}>"Saanjh provided exactly the kind of khandani matches our parents were looking for!"</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row my-5 gy-4">
                        <div className="col-sm">
                            <div className="card shadow-sm border-0" style={{ borderRadius: "15px", overflow: "hidden" }}>
                                <img className="card-img-top" src={success4} alt="Card cap" />
                                <div className="card-body" style={{ backgroundColor: "#fffdf9" }}>
                                    <h5 className="card-title" style={{ color: "#800000", fontWeight: "bold" }}>Gurdeep & Amrit</h5>
                                    <p style={{ fontStyle: "italic", color: "#666" }}>"Two pind, one heart. Thanks to Saanjh for letting us find our soulmates."</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="card shadow-sm border-0" style={{ borderRadius: "15px", overflow: "hidden" }}>
                                <img className="card-img-top" src={success5} alt="Card cap" />
                                <div className="card-body" style={{ backgroundColor: "#fffdf9" }}>
                                    <h5 className="card-title" style={{ color: "#800000", fontWeight: "bold" }}>Kabir & Meher</h5>
                                    <p style={{ fontStyle: "italic", color: "#666" }}>"A modern romance rooted in deep tradition. We found each other instantly."</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="card shadow-sm border-0" style={{ borderRadius: "15px", overflow: "hidden" }}>
                                <img className="card-img-top" src={success6} alt="Card cap" />
                                <div className="card-body" style={{ backgroundColor: "#fffdf9" }}>
                                    <h5 className="card-title" style={{ color: "#800000", fontWeight: "bold" }}>Aman & Kiran</h5>
                                    <p style={{ fontStyle: "italic", color: "#666" }}>"The best portal for genuine Punjabi brides and grooms. Highly recommended!"</p>
                                </div>
                            </div>
                        </div>





                    </div>
                </div>






            </div>

        </>
    )
}

export default Success