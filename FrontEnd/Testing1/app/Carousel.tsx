import styled from '@emotion/native';
import React, {useState} from 'react';
import {ScrollView} from 'react-native';


const CarouselContainer = styled.View`
  flex: 1;
`;
const Row = styled.View`
  flex-direction: row;
`;
const CarouselItemContainer = styled.View`
  width: ${(props: {width: number}) => props.width}px;
  height: 100%;
  padding: 20px;
`;
const CarouselItem = styled.View`
  flex: 1;
  background-color: ${(props: {color: string}) => props.color};
`;

const ScrollViewCarousel = () => {
  const data = ['tomato', 'skyblue', 'green', 'beige', 'yellow'];
  const [itemWidth, setItemWidth] = useState(0);

  return (
    <CarouselContainer style={{flex: 1}}>
      <ScrollView
        style={{flex: 1}}
        horizontal
        pagingEnabled
        contentContainerStyle={{width: `${100 * data.length}%`}}
        scrollEventThrottle={200}
        decelerationRate="fast"
        onContentSizeChange={w => setItemWidth(w / data.length)}
        showsHorizontalScrollIndicator={false}>
        <Row>
          {data.map((item: string) => {
            return (
              <CarouselItemContainer key={item} width={itemWidth}>
                <CarouselItem color={item} />
              </CarouselItemContainer>
            );
          })}
        </Row>
      </ScrollView>
    </CarouselContainer>
  );
};

export default ScrollViewCarousel;

