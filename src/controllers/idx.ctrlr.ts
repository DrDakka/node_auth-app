import http from 'http';

const index = '<h1>some-html<h1>';

const idx = (res: http.ServerResponse) => {
  // setCors();
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end(index);
};

export default idx;