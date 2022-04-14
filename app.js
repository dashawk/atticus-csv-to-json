const csv = require('csvtojson');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

const asyncHandler = require('./asyncHandler');

const fileLocation = path.resolve(__dirname, 'assets');

(async () => {
  fs.readdir(fileLocation, { encoding: 'utf-8' }, (err, files) => {

    if (err) {
      return console.log(err);
    }

    files.forEach(asyncHandler(async file => {
      const converter = csv({
        trim: true,
        delimiter: '||'
      });

      const filename = file.split('.')[0];
      const contents = await converter.fromFile(`${fileLocation}/${file}`);

      const users = [];

      contents.forEach(user => {
        const date = formatDate(user.date);
        const userDate = moment(date).format('YYYY-MM-DD');

        users.push({
          name: `${user.first_name} ${user.last_name}`,
          phone: user.phone,
          person: {
            firstName: user.first_name,
            lastName: user.last_name
          },
          amount: parseFloat(user.amount),
          date: userDate
        });
      });

      fs.writeFile(`${filename}.json`, JSON.stringify(users, null, 2), err => {
        if (err) {
          return console.log(`Something went wrong while writing json files.`);
        }

        console.log(`Parsing ${file} done...`);
      });


      // .then(rawJSON => {




      //   // fs.writeFile(`${filename}.json`, JSON.stringify(rawJSON), err => {

      //   // });
      //   // rawJSON.forEach(data => {
      //   //   let headers = Object.keys(data);

      //   //   const columns = headers[0].split('||');

      //   //   const rowData = data[headers[0]];
      //   //   const row = rowData.split('||');

      //   //   const user = {};

      //   //   columns.forEach((col, index) => {
      //   //     col = col.replace(/\"/g, '');
      //   //     user[col] = row[index].replace(/\"/g, '');
      //   //   });



      //   // });
      // });
    }));
  });
})();

function zeroPad(str) {
  return str.length === 1 ? `0${str}` : str;
}

function formatDate(dateString) {
  const date = dateString.split('/');
  const year = date[2];

  let month = date[1];
  let day = date[0];

  return new Date(`${zeroPad(month)}/${zeroPad(day)}/${year}`);
}