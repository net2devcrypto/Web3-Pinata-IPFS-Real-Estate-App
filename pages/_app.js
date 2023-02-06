import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/custom.css';
import '../styles/heroes.css';
import 'sf-font'

export default function App({ Component, pageProps }) {
  return (
    <div>
    <header className="d-flex flex-wrap align-items-start justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
    <img className='col-md-1 px-2' src='pinatalogo.png' ></img>
    <a
      href="/"
      className="d-flex align-items-center col-md-2 mb-2 mb-md-0 text-dark text-decoration-none"
    ></a>
    <ul className="nav col-10 col-md-auto mb-2 justify-content-center mb-md-1">
      <li>
        <a href="/" className="nav-link px-4 link-dark" style={{fontFamily:'SF Pro Display', fontWeight:"bold", fontSize:'20px'}}>
          Listed
        </a>
      </li>
      <li>
        <a href="list" className="nav-link px-4 link-dark" style={{fontFamily:'SF Pro Display', fontWeight:"bold", fontSize:'20px'}}>
          List My Property!
        </a>
      </li>
    </ul>
  </header>
  <Component {...pageProps} />
  </div>
  )
}
