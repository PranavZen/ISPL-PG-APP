import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Swiper from "react-native-swiper";

const { width: screenWidth } = Dimensions.get("window");
const BASE_IMAGE_URL = "https://my.ispl.popopower.com/assets/img/banner/";

interface BannerItem {
  id: number;
  banner_image: string;
}

const BannerSlider: React.FC = () => {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBanners = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://my.ispl.popopower.com/api/banner/banner-mobile"
        );
        const data = await response.json();

        if (data.status) {
          setBanners(data.banner_list);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const renderBannerItem = (item: BannerItem) => (
    <View key={item.id} style={styles.bannerContainer}>
      <Image
        source={{ uri: `${BASE_IMAGE_URL}${item.banner_image}` }}
        style={styles.bannerImage}
      />
    </View>
  );

  return ( 
    <View style={styles.sliderContainer}>
      {loading ? (
        <ActivityIndicator size="large" color="#003899" />
      ) : (
        <Swiper
          autoplay={true}
          loop={true}
          autoplayTimeout={5}
          dotStyle={styles.dot}
          activeDotStyle={styles.activeDot}
        >
          {banners.map(renderBannerItem)}
        </Swiper>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    height: 170,
  },
  bannerContainer: {
    position: "relative",
  },
  bannerImage: {
    width: screenWidth,
    height: 170,
  },
  dot: {
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    width: 8,
    height: 8,
    marginBottom: -20,
  },
  activeDot: {
    backgroundColor: "#fff",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: -20,
  },
});

export default BannerSlider;
