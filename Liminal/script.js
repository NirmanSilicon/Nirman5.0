$(document).ready(function () {
    $(".scramble").scramble(3000, 20, "alphabet", true);
});

const tl = gsap.timeline();

tl.to(".Loading", {
    opacity: 0,
    delay: 2.5,
})
    .to(".loader", {
        opacity: 0,
        duration: 1,
        ease: "Expo.easeInOut",
    })
    .to(".loader", {
        y: "-100%",
        duration: 1,
    })
    .add("up")
    .to(
        ".svgwaala",
        {
            opacity: 1,
            delay: -1.7,
            ease: "Expo.easeInOut",
        },
        "donut"
    )
    .to(
        "#dotted",
        {
            opacity: 1,
            delay: -1.6,
            ease: "Expo.easeInOut",
        },
        "donut"
    )
    .to(
        "#donut",
        {
            opacity: 1,
            scale: 2,
            delay: -2.4,
            ease: "Expo.easeInOut",
            rotationY: "+=15",
            rotationX: "+=15",
            rotationZ: "+=15",
            duration: 3,
        },
        "up"
    );
const tl2 = gsap.timeline();

document.querySelector("#explore").addEventListener("click", function () {
    tl2
        .to("#donut", {
            width: "80vw",
            top: "-10%",
            rotate: "360deg",
            ease: "ease.out",
            duration: 1,
            opacity: 0,
            delay: -1,
        })
        .to(
            "#dotted",
            {
                opacity: 0,
            },
            "sw"
        )
        .to(".svgwaala", {
            opacity: 0,
        });
});
