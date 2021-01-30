# Network Overloader
### *Will be part of a series of repos I will call "Weaponry" (if I find any similar ideas)*

## How dis work?

It repeatedly runs speed test to overload the router.
I could've used UDP stuff or whatever but then I'm happy enough with that.

## Why?

Because my family likes to eat a lot of bandwidth. With it slowed down, they are gonna switch to network unintensive activities like... uhh reading news articles!

![what?](https://cdn.discordapp.com/attachments/800101004057378858/805079255377641492/unknown.png)

## How to make it work?

Install all required modules:
```bash
npm i
```

Make a new file named .env and put your **token (Scroll a little...)** in it
```bash
echo "FAST_TOKEN=[PUT_TOKEN_HERE]" >> .env
```

## How do I get a token?
Just go to fast.com, open the DevTooks then go the the network tab.

Reload the page, then look up for requests to `api.fast.com` using the [Filter URLs] search bar.
Click the only result.


See the part that looks like: 
```text
/v2?https=true&token=[TOKEN]&urlCount=5
```
 on the right panel that just popped up? Copy the `[TOKEN]` from there.

<sub><sup>...that's it, that's the token right there</sup></sub>

