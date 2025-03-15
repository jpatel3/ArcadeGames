#!/bin/bash

# Word Explorer - Asset Downloader
# This script downloads all necessary sound and image assets for the Word Explorer game

# Create directories if they don't exist
mkdir -p assets/images
mkdir -p assets/sounds

echo "Downloading sound assets..."

# Download sound effects
curl -L "https://freesound.org/data/previews/131/131660_2398403-lq.mp3" -o assets/sounds/correct.mp3
curl -L "https://freesound.org/data/previews/362/362205_6629905-lq.mp3" -o assets/sounds/incorrect.mp3
curl -L "https://freesound.org/data/previews/456/456966_9652915-lq.mp3" -o assets/sounds/complete.mp3
curl -L "https://freesound.org/data/previews/476/476177_9876687-lq.mp3" -o assets/sounds/hint.mp3
curl -L "https://freesound.org/data/previews/449/449267_6142149-lq.mp3" -o assets/sounds/background-music.mp3

echo "Sound assets downloaded successfully!"

echo "Downloading image assets..."

# Download word images for level 1
curl -L "https://cdn.pixabay.com/photo/2014/11/30/14/11/cat-551554_640.jpg" -o assets/images/cat.png
curl -L "https://cdn.pixabay.com/photo/2016/04/18/22/05/seashells-1337565_640.jpg" -o assets/images/sun.png
curl -L "https://cdn.pixabay.com/photo/2013/07/12/12/56/spinning-top-146111_640.png" -o assets/images/top.png
curl -L "https://cdn.pixabay.com/photo/2016/02/19/15/46/dog-1210559_640.jpg" -o assets/images/dog.png

# Download word images for level 2
curl -L "https://cdn.pixabay.com/photo/2017/08/05/12/34/bat-2583244_640.png" -o assets/images/bat.png
curl -L "https://cdn.pixabay.com/photo/2013/07/12/18/39/chewing-gum-153735_640.png" -o assets/images/gum.png
curl -L "https://cdn.pixabay.com/photo/2014/04/03/00/38/pig-308853_640.png" -o assets/images/pig.png
curl -L "https://cdn.pixabay.com/photo/2012/04/13/01/51/garbage-can-31656_640.png" -o assets/images/bin.png

# Download word images for level 3
curl -L "https://cdn.pixabay.com/photo/2017/01/31/17/10/animal-2025644_640.png" -o assets/images/fox.png
curl -L "https://cdn.pixabay.com/photo/2014/04/02/17/06/ladybug-307915_640.png" -o assets/images/bug.png
curl -L "https://cdn.pixabay.com/photo/2013/07/13/01/22/jam-155376_640.png" -o assets/images/jam.png
curl -L "https://cdn.pixabay.com/photo/2014/04/03/10/28/fan-310701_640.png" -o assets/images/fan.png
curl -L "https://cdn.pixabay.com/photo/2013/07/13/10/06/bread-156770_640.png" -o assets/images/bun.png

# Download word images for level 4
curl -L "https://cdn.pixabay.com/photo/2016/03/31/19/19/fun-1294677_640.png" -o assets/images/fun.png
curl -L "https://cdn.pixabay.com/photo/2017/01/31/15/33/jumping-2024646_640.png" -o assets/images/jump.png
curl -L "https://cdn.pixabay.com/photo/2014/04/02/10/55/star-304967_640.png" -o assets/images/star.png

# Download word images for level 5
curl -L "https://cdn.pixabay.com/photo/2014/04/02/10/41/frog-304213_640.png" -o assets/images/frog.png
curl -L "https://cdn.pixabay.com/photo/2016/04/01/09/29/cartoon-1299393_640.png" -o assets/images/fish.png
curl -L "https://cdn.pixabay.com/photo/2013/07/13/12/15/bear-159023_640.png" -o assets/images/bear.png

# Download word images for level 6
curl -L "https://cdn.pixabay.com/photo/2013/07/13/12/08/boat-159148_640.png" -o assets/images/boat.png
curl -L "https://cdn.pixabay.com/photo/2016/04/01/10/04/cake-1299682_640.png" -o assets/images/cake.png
curl -L "https://cdn.pixabay.com/photo/2013/07/13/10/51/pen-157141_640.png" -o assets/images/pen.png
curl -L "https://cdn.pixabay.com/photo/2014/04/02/10/41/tree-304212_640.png" -o assets/images/tree.png

# Download word images for level 7
curl -L "https://cdn.pixabay.com/photo/2018/08/12/16/59/tiger-3601490_640.jpg" -o assets/images/tiger.png
curl -L "https://cdn.pixabay.com/photo/2013/07/13/13/21/wagon-160857_640.png" -o assets/images/wagon.png
curl -L "https://cdn.pixabay.com/photo/2014/04/02/10/47/sheep-304974_640.png" -o assets/images/sheep.png

# Download word images for level 8
curl -L "https://cdn.pixabay.com/photo/2014/04/03/10/51/paper-311566_640.png" -o assets/images/paper.png
curl -L "https://cdn.pixabay.com/photo/2016/03/31/15/22/lake-1293826_640.png" -o assets/images/lake.png
curl -L "https://cdn.pixabay.com/photo/2013/07/13/10/24/cloud-157160_640.png" -o assets/images/cloud.png
curl -L "https://cdn.pixabay.com/photo/2014/04/03/00/42/house-309113_640.png" -o assets/images/house.png

# Download word images for level 9
curl -L "https://cdn.pixabay.com/photo/2017/01/31/20/53/brain-2027062_640.png" -o assets/images/brain.png
curl -L "https://cdn.pixabay.com/photo/2014/04/03/10/51/moon-311339_640.png" -o assets/images/moon.png
curl -L "https://cdn.pixabay.com/photo/2013/07/13/13/19/swim-160847_640.png" -o assets/images/swim.png
curl -L "https://cdn.pixabay.com/photo/2014/04/02/10/47/flower-304573_640.png" -o assets/images/flower.png

# Download word images for level 10
curl -L "https://cdn.pixabay.com/photo/2014/04/03/10/29/garden-310212_640.png" -o assets/images/garden.png
curl -L "https://cdn.pixabay.com/photo/2014/04/02/10/41/rabbit-304314_640.png" -o assets/images/rabbit.png
curl -L "https://cdn.pixabay.com/photo/2012/04/12/20/43/button-30644_640.png" -o assets/images/button.png

# Download favicon and game screenshot
curl -L "https://cdn.pixabay.com/photo/2016/03/31/19/50/book-1295170_640.png" -o assets/images/favicon.png
# Download a more fun and colorful game screenshot
curl -L "https://cdn.pixabay.com/photo/2017/08/06/22/01/books-2596809_640.jpg" -o assets/images/game-screenshot.jpg

echo "Image assets downloaded successfully!"

echo "All assets have been downloaded successfully!"
