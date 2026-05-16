const BASE = '/api';

function getToken() { return localStorage.getItem('token'); }

function headers(isJson) {
  if (isJson === undefined) isJson = true;
  var h = {};
  if (isJson) h['Content-Type'] = 'application/json';
  var token = getToken();
  if (token) h['Authorization'] = 'Bearer ' + token;
  return h;
}

async function request(url, options) {
  if (!options) options = {};
  var res = await fetch(BASE + url, options);
  var data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

export async function signup(name, email, password) {
  return request('/auth/signup', { method: 'POST', headers: headers(), body: JSON.stringify({ name, email, password }) });
}
export async function login(email, password) {
  return request('/auth/login', { method: 'POST', headers: headers(), body: JSON.stringify({ email, password }) });
}
export async function fetchMe() {
  return request('/auth/me', { headers: headers() });
}

export async function fetchClothes() {
  return request('/clothes');
}
export async function getCart() {
  return request('/cart', { headers: headers() });
}
export async function addToCartAPI(item, days) {
  return request('/cart', {
    method: 'POST', headers: headers(),
    body: JSON.stringify({
      clothId: item._id, name: item.name, image: item.image, price: item.price,
      size: item.size, type: item.type, color: item.color, gender: item.gender,
      days: days || 1
    })
  });
}
export async function updateCartDaysAPI(index, days) {
  return request('/cart/' + index, {
    method: 'PATCH', headers: headers(),
    body: JSON.stringify({ days: days })
  });
}
export async function removeFromCartAPI(index) {
  return request('/cart/' + index, { method: 'DELETE', headers: headers() });
}
export async function clearCartAPI() {
  return request('/cart', { method: 'DELETE', headers: headers() });
}
export async function getFavourites() {
  return request('/favourites', { headers: headers() });
}
export async function toggleFavouriteAPI(clothId) {
  return request('/favourites', { method: 'POST', headers: headers(), body: JSON.stringify({ clothId }) });
}
export async function createListing(formData) {
  var token = getToken();
  var h = {};
  if (token) h['Authorization'] = 'Bearer ' + token;
  var res = await fetch(BASE + '/listings', { method: 'POST', headers: h, body: formData });
  var data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}
export async function getOrders() {
  return request('/orders', { headers: headers() });
}
export async function checkout(renterLocationUrl) {
  return request('/orders', {
    method: 'POST', headers: headers(),
    body: JSON.stringify({ renterLocationUrl: renterLocationUrl })
  });
}

// OTP Auth Endpoints
export async function requestChangeEmailOTP(newEmail) {
  return request('/auth/otp/change-email', {
    method: 'POST', headers: headers(),
    body: JSON.stringify({ newEmail })
  });
}

export async function verifyChangeEmail(otp, newEmail) {
  return request('/auth/verify-change-email', {
    method: 'POST', headers: headers(),
    body: JSON.stringify({ otp, newEmail })
  });
}

export async function requestChangePasswordOTP() {
  return request('/auth/otp/change-password', {
    method: 'POST', headers: headers()
  });
}

export async function verifyChangePassword(otp, currentPassword, newPassword) {
  return request('/auth/verify-change-password', {
    method: 'POST', headers: headers(),
    body: JSON.stringify({ otp, currentPassword, newPassword })
  });
}

export async function requestForgotPasswordOTP(email) {
  return request('/auth/otp/forgot-password', {
    method: 'POST', headers: headers(true),
    body: JSON.stringify({ email })
  });
}

export async function resetPassword(email, otp, newPassword) {
  return request('/auth/reset-password', {
    method: 'POST', headers: headers(true),
    body: JSON.stringify({ email, otp, newPassword })
  });
}
