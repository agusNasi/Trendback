import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from './sreens/HomeScreen';
import ProductSreen from './sreens/ProductSreen';
import NavBar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Badge from 'react-bootstrap/esm/Badge';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { Store } from './Store';
import CartScreen from './sreens/CartScreen';
import SigninScreen from './sreens/SigninScreen';
import ShippingAddressScreen from './sreens/ShippingAddressScreen';
import SignupScreen from './sreens/SignupScreen';
import PaymentMethodScreen from './sreens/PaymentMethodScreen';
import PlaceOrderScreen from './sreens/PlaceOrderScreen';
import OrderScreen from './sreens/OrderScreen';
import OrderHistoryScreen from './sreens/OrderHistoryScreen';
import ProfileScreen from './sreens/ProfileScreen';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { getError } from './utils';
import SearchBox from './components/SearchBox';
import SearchScreen from './sreens/SearchScreen';
import ProtectedRoutes from './components/ProtectedRoutes';
import DashboardScreen from './sreens/DashboardScreen';
import AdminRoutes from './components/AdminRoutes';
import ProductListScreen from './sreens/ProductListScreen';
import ProductEditScreen from './sreens/ProductEditScreen';
import OrderListScreen from './sreens/OrderListScreen';
import UserListScreen from './sreens/UserListScreen';
import UserEditScreen from './sreens/UserEditScreen';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  return (
    <BrowserRouter>
      <div
        className={
          sidebarIsOpen
            ? 'd-flex flex-column site-container active-cont'
            : 'd-flex flex-column site-container'
        }
      >
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <NavBar bg="dark" variant="dark" expand="lg">
            <Container>
              <Button
                variant="dark"
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <i className="fas fa-bars"></i>
              </Button>
              <LinkContainer to="/">
                <NavBar.Brand>Trendback</NavBar.Brand>
              </LinkContainer>
              <NavBar.Toggle aria-controls="basic-navbar-nav" />
              <NavBar.Collapse id="basic-navbar-nav">
                <SearchBox />
                <Nav className="me-auto w-100 justify-content-end">
                  <Link to="/cart" className="nav-link">
                    Carrito
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Link>
                  {userInfo ? (
                    <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>Perfil</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item>Historial de orden</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        Cerrar Sesion
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link className="nav-link" to="/signin">
                      Iniciar Sesion
                    </Link>
                  )}
                  {userInfo && userInfo.isAdmin && (
                    <NavDropdown title="Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>Panel</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/products">
                        <NavDropdown.Item>Productos</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orders">
                        <NavDropdown.Item>Ordenes</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/users">
                        <NavDropdown.Item>Usuarios</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                </Nav>
              </NavBar.Collapse>
            </Container>
          </NavBar>
        </header>
        <div
          className={
            sidebarIsOpen
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Categorias</strong>
            </Nav.Item>
            {categories.map((category) => (
              <Nav.Item key={category}>
                <LinkContainer
                  to={{ pathname: '/search', search: `category=${category}` }}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link>{category}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductSreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoutes>
                    <ProfileScreen />
                  </ProtectedRoutes>
                }
              />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoutes>
                    <OrderScreen />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoutes>
                    <OrderHistoryScreen />
                  </ProtectedRoutes>
                }
              />
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoutes>
                    <DashboardScreen />
                  </AdminRoutes>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <AdminRoutes>
                    <OrderListScreen />
                  </AdminRoutes>
                }
              ></Route>
              <Route
                path="/admin/users"
                element={
                  <AdminRoutes>
                    <UserListScreen />
                  </AdminRoutes>
                }
              ></Route>
              <Route
                path="/admin/products"
                element={
                  <AdminRoutes>
                    <ProductListScreen />
                  </AdminRoutes>
                }
              ></Route>
              <Route
                path="/admin/product/:id"
                element={
                  <AdminRoutes>
                    <ProductEditScreen />
                  </AdminRoutes>
                }
              ></Route>
              <Route
                path="/admin/user/:id"
                element={
                  <AdminRoutes>
                    <UserEditScreen />
                  </AdminRoutes>
                }
              ></Route>
              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">Todos Los Derechos Reservados</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
