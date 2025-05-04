const apiKey = '7d0a3d29537a1c1b02d0de961653999f';

const waterfalls = [
  {
    name: "Bogatha Waterfalls",
    location: "Mulugu",
    image: "https://www.zingbus.com/blog/wp-content/uploads/2024/01/Bogatha-Waterfalls-1024x576.jpg",
    latitude: 17.6333,
    longitude: 80.1306
  },
  {
    name: "Kuntala Waterfalls",
    location: "Adilabad",
    image: "https://media.assettype.com/outlooktraveller%2F2024-02%2Fa6454e35-a613-4c9b-822e-b71ea409aae8%2F27589760643_04d6f58320_o.jpg?w=768&auto=format%2Ccompress&fit=max",
    latitude: 19.2653,
    longitude: 78.4999,
  },
  {
    name: "Pochera Falls",
    location: "Adilabad",
    image: "https://media-cdn.tripadvisor.com/media/photo-s/09/52/4d/90/pochera-waterfalls.jpg",
    latitude: 19.1750,
    longitude: 78.5241
  },
  {
    name: "Ethipothala Falls",
    location: "Near Nagarjuna Sagar",
    image: "https://imgstaticcontent.lbb.in/lbbnew/wp-content/uploads/2018/05/24143258/ethipothala.png?fm=webp&w=750&h=500&dpr=1",
    latitude: 16.7775,
    longitude: 79.2045
  },
  {
    name: "Mallela Theertham",
    location: "Nagarkurnool",
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/06/da/88/b3/mallela-theertham-waterfalls.jpg?w=900&h=500&s=1",
    latitude: 16.7254,
    longitude: 78.5929
  },
  {
    name: "Gayatri Waterfalls",
    location: "Adilabad",
    image: "https://www.indiatourismguide.in/wp-content/uploads/2021/09/Gayatri-Waterfalls.jpg",
    latitude: 19.1103,
    longitude: 78.4840
  }
];

// Get Elements
const section = document.getElementById("waterfalls");
const modal = document.getElementById("modal");
const modalImage = document.getElementById("modalImage");
const modalName = document.getElementById("modalName");
const modalLocation = document.getElementById("modalLocation");
const modalStatus = document.getElementById("modalStatus");
const modalWeather = document.getElementById("modalWeather");
const closeModal = document.getElementById("closeModal");
const navigateButton = document.getElementById("navigateButton");

// Close Modal
closeModal.addEventListener('click', () => {
  modal.classList.add('hidden');
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.add('hidden');
  }
});

// flow identified here(main logic)
function getFlowStatus(rainfall) {
  if (rainfall > 60) {
    return "High flow – Be cautious!";
  } else if (rainfall > 20) {
    return "Moderate flow – Great time to visit!";
  } else {
    return "Low flow – Might be dry";
  }
}

async function getWeatherData(lat, lon) {
  try {
    const currentRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
    const currentData = await currentRes.json();
    const temp = currentData.main.temp;
    const condition = currentData.weather[0].description;

    const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
    const forecastData = await forecastRes.json();

    let rainfall = 0;
    const now = new Date();
    forecastData.list.forEach(item => {
      const itemDate = new Date(item.dt * 1000);
      const diffDays = (itemDate - now) / (1000 * 60 * 60 * 24);
      if (diffDays <= 3 && item.rain && item.rain['3h']) {
        rainfall += item.rain['3h'];
      }
    });

    const flowStatus = getFlowStatus(rainfall);

    return {
      weatherText: `Temperature: ${temp}°C, Condition: ${condition}, Rain (3 days): ${rainfall.toFixed(1)} mm`,
      flowStatus
    };
  } catch (err) {
    console.error(err);
    return {
      weatherText: "Weather data unavailable",
      flowStatus: "Flow status unavailable"
    };
  }
}

// Build UI
waterfalls.forEach(async (waterfall) => {
  const { weatherText, flowStatus } = await getWeatherData(waterfall.latitude, waterfall.longitude);

  const card = document.createElement("div");
  card.className = "bg-white shadow-xl rounded-2xl overflow-hidden transition hover:scale-105 duration-300 cursor-pointer";
  card.innerHTML = `
    <img src="${waterfall.image}" alt="${waterfall.name}" class="w-full h-48 object-cover">
    <div class="p-4 space-y-2">
      <h3 class="text-xl font-semibold text-gray-800">${waterfall.name}</h3>
      <p class="text-gray-500"><strong>📍 Location:</strong> ${waterfall.location}</p>
      <p class="text-sm"><strong>💧 Flow:</strong> <span class="text-blue-600">${flowStatus}</span></p>
      <p class="text-sm"><strong>🌤️ Weather:</strong> ${weatherText}</p>
    </div>
  `;

  card.addEventListener('click', () => {
    modalImage.src = waterfall.image;
    modalName.textContent = waterfall.name;
    modalLocation.innerHTML = `<strong>📍 Location:</strong> ${waterfall.location}`;
    modalStatus.innerHTML = `<strong>💧 Flow:</strong> ${flowStatus}`;
    modalWeather.innerHTML = `<strong>🌤️ Weather:</strong> ${weatherText}`;
    navigateButton.href = `https://www.google.com/maps/search/?api=1&query=${waterfall.latitude},${waterfall.longitude}`;
    modal.classList.remove('hidden');
  });

  section.appendChild(card);
});
card.addEventListener('click', () => {
  window.location.href = `waterfall.html?name=${encodeURIComponent(waterfall.name)}`;
});
