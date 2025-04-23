const SAMPLE_FEATURES = {
  show_dialogue_box: true,
  enable_new_pricing: true,
};

const CAHCHE = {
  feature_flags: {},
  timestamp: 0,
};

const TTL = 5000;

function fetchAllFeature() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(SAMPLE_FEATURES);
    }, 100);
  });
}

async function getFeatureFlag(name, defaultValue) {
  try {
    const isCachePresent = Object.keys(CAHCHE.feature_flags).length > 0;
    const isCacheFresh = Date.now() - CAHCHE.timestamp < TTL;

    if (isCachePresent && isCacheFresh) {
      console.log("from cache");
      return Object.prototype.hasOwnProperty.call(CAHCHE.feature_flags, name)
        ? CAHCHE.feature_flags[name]
        : defaultValue;
    }

    console.log("making calls");

    const featureFlags = await fetchAllFeature();
    CAHCHE.feature_flags = featureFlags;
    return Object.prototype.hasOwnProperty.call(featureFlags, name)
      ? featureFlags[name]
      : defaultValue;
  } catch (error) {
    // log err / send this error to sentry
    return defaultValue;
  }
}

getFeatureFlag("show_dialogue_box", false).then((value) => {
  if (value) {
    console.log("show_dialogue_box is enabled");
  } else {
    console.log("show_dialogue_box is disabled");
  }
});

getFeatureFlag("enable_new_pricing", false).then((value) => {
  if (value) {
    console.log("enable_new_pricing is enabled");
  } else {
    console.log("enable_new_pricing is disabled");
  }
});

setTimeout(() => {
  getFeatureFlag("show_dialogue_box", false).then((value) => {
    if (value) {
      console.log("show_dialogue_box is enabled");
    } else {
      console.log("show_dialogue_box is disabled");
    }
  });
}, 3000);
