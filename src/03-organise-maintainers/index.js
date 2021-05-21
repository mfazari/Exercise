const axios = require('axios');
let maintainers;

/**
 * Make the following POST request with either axios or node-fetch:

 POST url: http://ambush-api.inyourarea.co.uk/ambush/intercept
 BODY: {
    "url": "https://api.npms.io/v2/search/suggestions?q=react",
    "method": "GET",
    "return_payload": true
}

 *******

 The results should have this structure:
 {
    "status": 200.0,
    "location": [
      ...
    ],
    "from": "CACHE",
    "content": [
      ...
    ]
}

 ******

 * With the results from this request, inside "content",
 * list every maintainer and each package name that they maintain,
 * return an array with the following shape:
 [
 ...
 {
        username: "a-username",
        packageNames: ["a-package-name", "another-package"]
    }
 ...
 ]
 * NOTE: the parent array and each "packageNames" array should
 * be in alphabetical order.
 */

module.exports = async function organiseMaintainers() {
  axios
    .post('http://ambush-api.inyourarea.co.uk/ambush/intercept', {
      url: 'https://api.npms.io/v2/search/suggestions?q=react',
      method: 'GET',
      return_payload: true,
    })
    .then(function(response) {
      var json = response.data.content;
      //console.log(json[0].package);
      //array_2[0].packageNames.push(5);

      // Creating a temporary array with username and package name properties
      var temp = [];
      for (var y = 0; y < json.length; y++) {
        for (var z = 0; z < json[y].package.maintainers.length; z++) {
          temp.push({
            username: json[y].package.maintainers[z].username,
            packageNames: json[y].package.name,
          });
        }
      }

      // Merging data
      maintainers = temp.reduce((acc, d) => {
        const found = acc.find(a => a.username === d.username);
        const value = { packageNames: d.packageNames }; // the element in data property
        if (!found) {
          acc.push({ username: d.username, packageNames: [value] }); // need to add data property if not found
        } else {
          found.packageNames.push(value); // data property exists, push new element to found.data.
        }
        return acc;
      }, []);

      //console.log(result[1].packageNames);

      // Sorting data
      // Sort by user name
      maintainers.sort((a, b) => a.username.localeCompare(b.username));

      // Sort by package name
      for (var s = 0; s < maintainers.length; s++) {
        maintainers[s].packageNames.sort((a, b) =>
          a.packageNames.localeCompare(b.packageNames),
        );
      }
      console.log(maintainers);
    });

  return maintainers;
};
